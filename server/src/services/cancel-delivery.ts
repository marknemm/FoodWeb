import { EntityManager, getConnection } from 'typeorm';
import { sendDeliveryCancelledMessage } from './cancel-delivery-message';
import { saveAudit, getAuditAccounts } from './save-audit';
import { DeliveryEntity } from '../entity/delivery-entity';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { Donation } from '../../../shared/src/helpers/donation-helper';

export async function cancelDelivery(donation: Donation, myAccount: AccountEntity, manager?: EntityManager): Promise<Donation> {
  if (manager) {
    // If passed an EntityManager instance, then we have external model doing donation modifications.
    return _deleteDelivery(donation, manager);
  }

  // Otherwise, we must do the donation modifications here.
  const cancelledDonation: Donation = await getConnection().transaction(
    async (localManager: EntityManager) => {
      return _deleteDelivery(donation, localManager);
    }
  );

  await sendDeliveryCancelledMessage(cancelledDonation, myAccount);
  saveAudit('Cancel Delivery', getAuditAccounts(donation), cancelledDonation, donation);
  return cancelledDonation;
}

async function _deleteDelivery(donation: Donation, manager: EntityManager): Promise<Donation> {
  let cancelledDonation: Donation = Object.assign({}, donation);
  await manager.getRepository(DeliveryEntity).delete(cancelledDonation.delivery.id);
  cancelledDonation.donationStatus = 'Matched';
  cancelledDonation.delivery = null;
  cancelledDonation = await manager.getRepository(DonationEntity).save(cancelledDonation);
  return cancelledDonation;
}
