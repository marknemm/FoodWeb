import { getRepository } from 'typeorm';
import { Account, DonationHubPledge, ValidationHelper } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { FoodWebError } from '~web/helpers/response/foodweb-error';

const _validationHelper = new ValidationHelper();

export function validateDonationHubPledge(donationHubPledge: DonationHubPledge): void {
  if (!donationHubPledge) { return; }

  const requireErr: string = _validationHelper.validateProps(donationHubPledge, ['foodType', 'foodCount']);
  if (requireErr) { throw new FoodWebError(requireErr); }

  if (donationHubPledge.foodCount <= 0) {
    throw new FoodWebError('Donation must have a food count greater than 0');
  }
}

export async function validateDonationHubPledgeUpdatePrivilege(donationHubPledge: DonationHubPledge, myAccount: Account): Promise<void> {
  if (!donationHubPledge.id) { return; } // If not an update, then skip this check.
  const donationHubPledgeAccountData: any = await getRepository(DonationHubPledgeEntity).createQueryBuilder('donationHubPledge')
    .select('donationHubPledge.id', 'donationHubPledgeId')
    .addSelect('account.id', 'accountId')
    .innerJoin('donationHubPledge.account', 'account')
    .where('donationHubPledge.id = :donationHubPledgeId', { donationHubPledgeId: donationHubPledge.id })
    .getRawOne();
  if (donationHubPledgeAccountData.accountId !== myAccount.id) {
    throw new FoodWebError('You do not have permission to update this donation hub pledge');
  }
}
