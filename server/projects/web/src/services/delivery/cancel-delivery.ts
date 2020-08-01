import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity, DeliveryEntity, DonationEntity } from '~entity';
import { DonationHelper, DonationStatus } from '~shared';
import { FoodWebError } from '~web/helpers/response/foodweb-error';
import { readDonation } from '../donation/read-donations';

const _donationHelper = new DonationHelper();

/**
 * Cancels the delivery of a given donation (as part of a larger database transaction).
 * @param donation The donation that is to have its delivery cancelled.
 * @param myAccount The account of the current user submitting the request.
 * @param manager An entity manager that should be passed in when this is part of a larger database operation.
 * @return A promise that resolves once the operation completes.
 * @throws FoodWebError if the user that submitted the request is not authroized to cancel the delivery.
 */
export async function cancelDelivery(donation: DonationEntity, myAccount: AccountEntity, manager: EntityManager): Promise<void>;

/**
 * Cancels the delivery of a given donation.
 * @param donation The donation that is to have its delivery cancelled.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise resolving to the donation after it has had its delivery cancelled.
 * @throws FoodWebError if the user that submitted the request is not authroized to cancel the delivery.
 */
export async function cancelDelivery(cancelReq: DonationEntity, myAccount: AccountEntity): Promise<DonationEntity>;

export async function cancelDelivery(
  donation: DonationEntity,
  myAccount: AccountEntity,
  manager?: EntityManager
): Promise<DonationEntity | void> {
  if (manager) {
    await _deleteDelivery(donation, myAccount, manager);
  } else {
    await getConnection().transaction(
      async (localManager: EntityManager) => await _deleteDelivery(donation, myAccount, localManager)
    );
    return await readDonation(donation.id);
  }
}

/**
 * Deletes the delivery entry associated with a given donation.
 * @param donation The donation that is to have its associated delivery entry deleted.
 * @param myAccount The account of the user submitting the delivery cancellation request.
 * @param manager The TypeORM entity/database manager that is to be used for the database access operation.
 * @return A promise that resolves once the delete operation completes.
 * @throws FoodWebError if the user that submitted the request is not authroized to cancel the delivery.
 */
async function _deleteDelivery(donation: DonationEntity, myAccount: AccountEntity, manager: EntityManager): Promise<void> {
  _ensureCanCancelDelivery(donation, myAccount);
  await manager.getRepository(DonationEntity).update(donation.id, { donationStatus: DonationStatus.Matched });
  await manager.getRepository(DeliveryEntity).remove(donation.claim.delivery);
}

/**
 * Ensures that a given user is authroized to cancel the delivery of a given donation.
 * @param donation The donation that is to have its delivery cancelled.
 * @param account The user account that is to be checked for authorization.
 * @throws FoodWebError if the given user is not authorized to cancel the delivery of the given donation.
 */
function _ensureCanCancelDelivery(donation: DonationEntity, account: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDeliveryCancelPrivilege(donation, account);
  if (errMsg) {
    throw new FoodWebError(`Delete failed: ${errMsg}`);
  }
}
