import { getRepository } from 'typeorm';
import { Account, AccountHelper, DonationHub, ValidationHelper } from '~shared';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { FoodWebError } from '~web/helpers/response/foodweb-error';

const _validationHelper = new ValidationHelper();
const _accountHelper = new AccountHelper();

/**
 * Validates a given donation hub.
 * @param donationHub The donation hub to validate. If null, then validation automatically passes.
 * @param requireId Set to true if the `id` field should be required. Defaults to false.
 * @throws `FoodWebError` if the donation hub is invalid.
 */
export function validateDonationHub(donationHub: DonationHub, requireId = false): void {
  if (!donationHub) { return; }

  const requireProps = <(keyof DonationHub)[]>['dropOffInstructions', 'dropOffWindowStart', 'dropOffWindowEnd'].concat(
    requireId ? ['id'] : []
  );
  const requireErr: string = _validationHelper.validateProps(donationHub, requireProps);
  if (requireErr) { throw new FoodWebError(requireErr); }

  if (donationHub.dropOffWindowStart >= donationHub.dropOffWindowEnd) {
    throw new FoodWebError('Drop-off window start time must be later than end time');
  }

  const contactInfoErr: string = _accountHelper.validateContactInfo(donationHub.contactOverride);
  if (contactInfoErr) { throw new FoodWebError(contactInfoErr); }
}

/**
 * Validates that a given account has update privileges for a given donation hub.
 * @param donationHub The donation hub to validate.
 * @param myAccount The account that is to be checked for update privileges.
 * @returns A promise that resolves once the validation finishes.
 * @throws `FoodWebError` if the donation hub update validation fails.
 */
export async function validateDonationHubUpdatePrivilege(donationHub: DonationHub, myAccount: Account): Promise<void> {
  const donationHubAccountData: any = await getRepository(DonationHubEntity).createQueryBuilder('donationHub')
    .select('donationHub.id', 'donationHubId')
    .addSelect('volunteerAccount.id', 'ownerId')
    .innerJoin('donationHub.volunteerAccount', 'volunteerAccount')
    .where('donationHub.id = :donationHubId', { donationHubId: donationHub.id })
    .getRawOne();
  validateDonationHubModPrivilege(donationHubAccountData.ownerId, myAccount);
}

/**
 * Validates that a given account has modification (delete/update) privileges for a given donation hub.
 * @param donationHub The ID of the donation hub that is to be validated.
 * @param myAccount The account that is to be checked for modification privileges.
 * @throws `FoodWebError` if the donation hub modification validation fails.
 */
export function validateDonationHubModPrivilege(ownerId: number, myAccount: Account): void {
  if (ownerId !== myAccount.id) {
    throw new FoodWebError('You do not have permission to delete/update this donation hub');
  }
}
