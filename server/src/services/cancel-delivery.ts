import { EntityManager, getConnection } from 'typeorm';
import { saveAudit, getAuditAccounts, AuditEventType } from './save-audit';
import { DeliveryEntity } from '../entity/delivery-entity';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { Donation, DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

/**
 * Cancels the delivery of a given donation.
 * @param donation The donation that is to have its delivery cancelled.
 * @param myAccount The account of the user submitting the delivery cancellation request.
 * @param manager An optional TypeORM entity/database manager that is to be used for the database access operation.
 * @return A promsie that resolves to the donation with its delivery cancelled.
 * @throws FoodWebError if the user that submitted the request is not authroized to cancel the delivery.
 */
export async function cancelDelivery(donation: Donation, myAccount: AccountEntity, manager?: EntityManager): Promise<DonationEntity> {
  if (manager) {
    // If passed an EntityManager instance, then we have external model doing donation modifications.
    return _deleteDelivery(donation, myAccount, manager);
  }

  // Otherwise, we must do the donation modifications here.
  const cancelledDonation: DonationEntity = await getConnection().transaction(
    async (localManager: EntityManager) => {
      return _deleteDelivery(donation, myAccount, localManager);
    }
  );

  saveAudit(AuditEventType.CancelDelivery, getAuditAccounts(donation), cancelledDonation, donation);
  return cancelledDonation;
}

/**
 * Deletes the delivery entry associated with a given donation.
 * @param donation The donation that is to have its associated delivery entry deleted.
 * @param myAccount The account of the user submitting the delivery cancellation request.
 * @param manager The TypeORM entity/database manager that is to be used for the database access operation.
 * @throws FoodWebError if the user that submitted the request is not authroized to cancel the delivery.
 */
async function _deleteDelivery(donation: Donation, myAccount: AccountEntity, manager: EntityManager): Promise<DonationEntity> {
  _ensureCanCancelDelivery(donation, myAccount);
  const deliveryToCancel: Donation = Object.assign({}, donation);
  await manager.getRepository(DeliveryEntity).delete(deliveryToCancel.delivery.id);
  deliveryToCancel.donationStatus = DonationStatus.Matched;
  deliveryToCancel.delivery = null;
  return await manager.getRepository(DonationEntity).save(deliveryToCancel);
}

/**
 * Ensures that a given user is authroized to cancel the delivery of a given donation.
 * @param donation The donation that is to have its delivery cancelled.
 * @param account The user account that is to be checked for authorization.
 * @throws FoodWebError if the given user is not authorized to cancel the delivery of the given donation.
 */
function _ensureCanCancelDelivery(donation: Donation, account: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDeliveryCancelPrivilege(donation, account);
  if (errMsg) {
    throw new FoodWebError(`Delete failed: ${errMsg}`);
  }
}
