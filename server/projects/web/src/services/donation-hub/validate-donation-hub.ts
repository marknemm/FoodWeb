import { getRepository } from 'typeorm';
import { Account, AccountHelper, DonationHub, ValidationHelper } from '~shared';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { FoodWebError } from '~web/helpers/response/foodweb-error';

const _validationHelper = new ValidationHelper();
const _accountHelper = new AccountHelper();

export function validateDonationHub(donationHub: DonationHub): void {
  if (!donationHub) { return; }

  const requireErr: string = _validationHelper.validateProps(donationHub, ['dropOffInstructions', 'dropOffWindowStart', 'dropOffWindowEnd']);
  if (requireErr) { throw new FoodWebError(requireErr); }

  if (donationHub.dropOffWindowStart >= donationHub.dropOffWindowEnd) {
    throw new FoodWebError('Drop-off window start time must be later than end time');
  }

  const contactInfoErr: string = _accountHelper.validateContactInfo(donationHub.contactOverride);
  if (contactInfoErr) { throw new FoodWebError(contactInfoErr); }
}

export async function validateDonationHubUpdatePrivilege(donationHub: DonationHub, myAccount: Account): Promise<void> {
  const donationHubAccountData: any = await getRepository(DonationHubEntity).createQueryBuilder('donationHub')
    .select('donationHub.id', 'donationHubId')
    .addSelect('volunteerAccount.id', 'ownerId')
    .innerJoin('donationHub.volunteerAccount', 'volunteerAccount')
    .where('donationHub.id = :donationHubId', { donationHubId: donationHub.id })
    .getRawOne();
  validateDonationHubModPrivilege(donationHubAccountData.ownerId, myAccount);
}

export function validateDonationHubModPrivilege(ownerId: number, myAccount: Account): void {
  if (ownerId !== myAccount.id) {
    throw new FoodWebError('You do not have permission to delete/update this donation hub');
  }
}
