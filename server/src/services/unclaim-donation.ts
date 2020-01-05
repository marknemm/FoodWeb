import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationClaimEntity } from '../entity/donation-claim.entity';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { UpdateDiff } from '../interfaces/update-diff';
import { Donation, DonationHelper, DonationStatus, DonationUnclaimRequest } from '../shared';
import { cancelDelivery } from './cancel-delivery';
import { readDonation } from './read-donations';

const _donationHelper = new DonationHelper();

/**
 * Unclaims a donation (as part of a larger database transaction).
 * @param donation The donation that is to be unclaimed.
 * @param myAccount The account of the current user submitting the request.
 * @param manager An entity manager that should be passed in when this is part of a larger database operation.
 * @return A promise that resolves once the operation completes.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
export async function unclaimDonation(donation: DonationEntity, myAccount: AccountEntity, manager: EntityManager): Promise<void>;

/**
 * Unclaims a donation.
 * @param unclaimReq The unclaim donation request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise resolving to the donation after it has been unclaimed.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
export async function unclaimDonation(unclaimReq: DonationUnclaimRequest, myAccount: AccountEntity): Promise<UpdateDiff<Donation>>;

export async function unclaimDonation(
  unclaimSrc: DonationUnclaimRequest | DonationEntity,
  myAccount: AccountEntity,
  manager?: EntityManager
): Promise<UpdateDiff<Donation> | void> {
  const donation: DonationEntity = await _getDonationToUnclaim(unclaimSrc);

  if (manager) {
    await _deleteClaim(donation, myAccount, manager);
  } else {
    await getConnection().transaction(
      async (localManager: EntityManager) => await _deleteClaim(donation, myAccount, localManager)
    );

    return {
      new: await readDonation(donation.id),
      old: donation
    };
  }
}

/**
 * Gets the donation that is to be unclaimed from a given raw donation unclaimSrc.
 * @param unclaimSrc The unclaim donation request or the donation that is to be unclaimed.
 * @return A promise that resolves to the donation that is to be unclaimed.
 */
async function _getDonationToUnclaim(unclaimSrc: DonationUnclaimRequest | DonationEntity): Promise<DonationEntity> {
  return (unclaimSrc instanceof DonationEntity)
    ? unclaimSrc
    : await readDonation(unclaimSrc.donationId);
}

/**
 * Deletes the DonationClaim entry associated with a given donation.
 * @param donation The donation that is to be unclaimed.
 * @param myAccount The account of the user that is unclaiming the donation.
 * @param manager The database manager used for the operation.
 * @return A promise that resolves once the operation is completed.
 */
async function _deleteClaim(donation: DonationEntity, myAccount: AccountEntity, manager: EntityManager): Promise<void> {
  _ensureCanUnclaimDonation(donation, myAccount);
  await _cancelDeliveryIfExists(donation, myAccount, manager);
  await manager.getRepository(DonationEntity).update(donation.id, { donationStatus: DonationStatus.Unmatched });
  await manager.getRepository(DonationClaimEntity).remove(donation.claim);
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
 * @return A promise that resolves once the operation completes.
 */
async function _cancelDeliveryIfExists(donation: DonationEntity, myAccount: AccountEntity, manager: EntityManager): Promise<void> {
  // If delivery exists, then cancel any associated delivery (without sending cancellation message).
  if (donation.delivery) {
    await cancelDelivery(donation, myAccount, manager);
  }
}
