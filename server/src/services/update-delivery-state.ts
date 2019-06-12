import { getConnection, EntityManager } from 'typeorm';
import { readDonation } from './read-donations';
import { FoodWebError } from '../helpers/food-web-error';
import { MailTransporter, broadcastEmail } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { cancelDelivery } from '../services/cancel-delivery';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { Account } from '../../../shared/src/interfaces/account/account';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';

const _donationHelper = new DonationHelper();
const _deliveryHelper = new DeliveryHelper();

export async function advanceDeliveryState(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(donationId);
  _ensureCanAdvanceDeliveryState(donation, myAccount);
  donation.donationStatus = _donationHelper.getNextDonationStatus(donation);
  _updateDeliveryTiming(donation);

  const advancedDonation: Donation = await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(donation)
  );
  await _sendDeliveryStateAdvancedMessage(advancedDonation);

  return advancedDonation;
}

function _ensureCanAdvanceDeliveryState(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryAdvancePrivilege(donation.delivery, donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery state advancement failed: ${errMsg}`);
  }
}

function _updateDeliveryTiming(donation: DonationEntity): void {
  if (donation.donationStatus === 'Scheduled') {
    donation.delivery.pickupTime = null;
  }
  if (donation.donationStatus === 'Picked Up') {
    donation.delivery.pickupTime = (new Date()).toUTCString();
    donation.delivery.dropOffTime = null;
  }
  if (donation.donationStatus === 'Complete') {
    donation.delivery.dropOffTime = (new Date()).toUTCString();
  }
}

async function _sendDeliveryStateAdvancedMessage(donation: Donation): Promise<void> {
  const sendAccounts: Account[] = [donation.donorAccount, donation.receiverAccount, donation.delivery.volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const advanceAction: string = (donation.donationStatus === 'Picked Up' ? 'Picked Up' : 'Completed');
  const emailTmpl: string = (donation.donationStatus === 'Picked Up' ? 'delivery-picked-up' : 'delivery-complete');
  const sendSubjects = [
    `Delivery Has Been ${advanceAction} by ${delivererName}`,
    `Delivery Has Been ${advanceAction} by ${delivererName}`,
    `Delivery from ${donorName} to ${receiverName} Status Updated to ${donation.donationStatus}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    sendAccounts,
    sendSubjects,
    emailTmpl,
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);
}

export async function undoDeliveryState(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(donationId);
  _ensureCanUndoDeliveryState(donation, myAccount);
  donation.donationStatus = _donationHelper.getPrevDonationStatus(donation);

  // If moving from 'Scheduled' to 'Matched', then perform delivery cancellation process.
  if (donation.donationStatus === 'Matched') {
    return cancelDelivery(donation, myAccount);
  }
  // Otherwise simply undo delivery state to a non-cancelled status.
  return _undoDeliveryStateNonCancel(donation);
}

async function _undoDeliveryStateNonCancel(donation: DonationEntity): Promise<Donation> {
  _updateDeliveryTiming(donation);
  const undoneDonation: Donation = await getConnection().transaction
    (async (manager: EntityManager) => manager.getRepository(DonationEntity).save(donation)
  );
  await _sendDeliveryStateUndoMessage(undoneDonation);
  return undoneDonation;
}

function _ensureCanUndoDeliveryState(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryUndoPrivilege(donation.delivery, donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery state undo failed: ${errMsg}`);
  }
}

async function _sendDeliveryStateUndoMessage(donation: Donation): Promise<void> {
  const sendAccounts: Account[] = [donation.donorAccount, donation.receiverAccount, donation.delivery.volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const sendSubjects = [
    `Delivery Status has been reverted to ${donation.donationStatus} by ${delivererName}`,
    `Delivery Status has been reverted to ${donation.donationStatus} by ${delivererName}`,
    `Delivery from ${donorName} to ${receiverName} Status Reverted to ${donation.donationStatus}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    sendAccounts,
    sendSubjects,
    'delivery-status-undo',
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);
}
