import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { UpdateDiff } from '../interfaces/update-diff';
import { Donation, DonationHelper, DonationStatus, DonationUnclaimRequest } from '../shared';
import { cancelDelivery } from './cancel-delivery';
import { readDonation } from './read-donations';

const _donationHelper = new DonationHelper();

/**
 * Unclaims a donation.
 * @param unclaimReq The unclaim donation request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise resolving to the donation after it has been unclaimed.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
export async function unclaimDonation(unclaimReq: DonationUnclaimRequest, myAccount: AccountEntity): Promise<UpdateDiff<Donation>> {
  const donationToUnclaim: Donation = await readDonation(unclaimReq.donationId);
  _ensureCanUnclaimDonation(donationToUnclaim, myAccount);

  let unclaimedDonation: Donation = Object.assign({}, donationToUnclaim);
  await getConnection().transaction(async (manager: EntityManager) => {
    unclaimedDonation = await _cancelDeliveryIfExists(unclaimedDonation, myAccount, manager);
    unclaimedDonation.donationStatus = DonationStatus.Unmatched;
    unclaimedDonation.claim = null;
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
function _ensureCanUnclaimDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationUnclaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation unclaim failed: ${errMsg}`);
  }
}

/**
 * Cancels the delivery associated with the donation that is to be unclaimed if it exists.
 * @param donation The donation that is to be unclaimed.
 * @param myAccount The account of the user that is unclaiming the donation.
 * @param manager The entity manager used for the unclaim database operation.
 * @return A promise that resolves to the donation with its delivery cancelled.
 */
async function _cancelDeliveryIfExists(donation: Donation, myAccount: AccountEntity, manager: EntityManager): Promise<Donation> {
  // If delivery exists, then cancel any associated delivery (without sending cancellation message).
  return (donation.delivery)
    ? await cancelDelivery(donation, myAccount, manager)
    : donation;
}
