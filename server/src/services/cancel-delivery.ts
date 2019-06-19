import { EntityManager, getConnection } from 'typeorm';
import { broadcastEmail, MailTransporter } from '../helpers/email';
import { DeliveryEntity } from '../entity/delivery-entity';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';

const _donationHelper = new DonationHelper();

export async function cancelDelivery(donation: Donation, myAccount: AccountEntity, manager?: EntityManager): Promise<Donation> {
  if (manager) {
    // If passed an EntityManager instance, then we have external model doing donation modifications.
    return _deleteDelivery(donation, manager);
  }

  // Otherwise, we must do the donation modifications here.
  const cancelledDonation: Donation = await getConnection().transaction(
    async (localManager: EntityManager) => {
      return _deleteDeliveryAndUpdateDonation(donation, localManager);
    }
  );

  await _sendDeliveryCancelledMessage(cancelledDonation, myAccount);
  return cancelledDonation;
}

async function _deleteDeliveryAndUpdateDonation(donation: Donation, manager: EntityManager): Promise<Donation> {
  donation.donationStatus = 'Matched';
  donation = await manager.getRepository(DonationEntity).save(donation);
  donation = await _deleteDelivery(donation, manager);
  return donation;
}

async function _deleteDelivery(donation: Donation, manager: EntityManager): Promise<Donation> {
  await manager.getRepository(DeliveryEntity).delete(donation.delivery.id);
  donation.delivery = null;
  return donation;
}

async function _sendDeliveryCancelledMessage(donation: Donation, myAccount: AccountEntity): Promise<void> {
  const sendAccounts: Account[] = [donation.donorAccount, donation.receiverAccount, myAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = `${myAccount.volunteer.firstName} ${myAccount.volunteer.lastName}`;
  const sendSubjects = [
    `Donation Delivery Cancelled by ${delivererName}`,
    `Donation Delivery Cancelled by ${delivererName}`,
    `Delivery Successfully Cancelled from ${donorName} to ${receiverName}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    sendAccounts,
    sendSubjects,
    'delivery-cancelled',
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);
}
