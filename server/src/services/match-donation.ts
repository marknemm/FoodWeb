import { getConnection, EntityManager } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { readDonation } from './read-donations';
import { cancelDelivery } from './cancel-delivery';
import { UpdateDiff } from '../interfaces/update-diff';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { Donation, DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { Account } from '../../../shared/src/interfaces/account/account';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DonationClaimRequest } from '../../../shared/src/interfaces/donation/donation-claim-request';
import { DonationUnclaimRequest } from '../../../shared/src/interfaces/donation/donation-unclaim-request';

const _donationHelper = new DonationHelper();

/**
 * Claims a donation.
 * @param claimReq The donation claim request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise that resolves to the donation after it has been claimed.
 * @throws FoodWebError if the user is not authorized to claim the donation.
 */
export async function claimDonation(claimReq: DonationClaimRequest, myAccount: AccountEntity): Promise<Donation> {
  const donationToClaim: Donation = await readDonation(claimReq.donationId, myAccount);
  _ensureCanClaimDonation(donationToClaim, myAccount);

  let claimedDonation: Donation = Object.assign({}, donationToClaim);
  claimedDonation.donationStatus = DonationStatus.Matched;
  claimedDonation.receiverAccount = myAccount;

  return getConnection().transaction(async (manager: EntityManager) =>
    manager.getRepository(DonationEntity).save(claimedDonation)
  );
}

/**
 * Ensures that the current user can claim a given donation.
 * @param donation The donation that is to be claimed.
 * @param myAccount The account of the user to check for claim authorization.
 * @throws FoodWebError if the user is not authorized to claim the donation.
 */
function _ensureCanClaimDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationClaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation claim failed: ${errMsg}`);
  }
}

/**
 * Unclaims a donation.
 * @param unclaimReq The unclaim donation request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise resolving to the donation after it has been unclaimed.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
export async function unclaimDonation(unclaimReq: DonationUnclaimRequest, myAccount: AccountEntity): Promise<UpdateDiff<Donation>> {
  const donationToUnclaim: Donation = await readDonation(unclaimReq.donationId, myAccount);
  _ensureCanUnclaimDonation(donationToUnclaim, myAccount);

  let unclaimedDonation: Donation = Object.assign({}, donationToUnclaim);
  await getConnection().transaction(async (manager: EntityManager) => {
    unclaimedDonation = await _cancelDeliveryIfExists(unclaimedDonation, myAccount, manager);
    unclaimedDonation.donationStatus = DonationStatus.Unmatched;
    unclaimedDonation.receiverAccount = null;
    unclaimedDonation = await manager.getRepository(DonationEntity).save(unclaimedDonation);
  });

  return { new: unclaimedDonation, old: donationToUnclaim };
}

/**
 * Ensures that the current user has privileges to unclaim a given donation.
 * @param donation The donation that is to be unclaimed.
 * @param myAccount The account of the user to check for unclaim privileges.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
function _ensureCanUnclaimDonation(donation: Donation, myAccount: Account): void {
  const errMsg: string = _donationHelper.validateDonationUnclaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation unclaim failed: ${errMsg}`);
  }
}

async function _cancelDeliveryIfExists(donation: Donation, myAccount: AccountEntity, manager: EntityManager): Promise<Donation> {
  // If delivery exists, then cancel any associated delivery (without sending cancellation message).
  return (donation.delivery)
    ? await cancelDelivery(donation, myAccount, manager)
    : donation;
}
