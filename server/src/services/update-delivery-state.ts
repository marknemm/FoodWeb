import { getConnection, EntityManager } from 'typeorm';
import { readDonation } from './read-donations';
import { sendDeliveryStateAdvancedMessage, sendDeliveryStateUndoMessage } from './update-delivery-state-message';
import { saveAudit, getAuditAccounts } from './save-audit';
import { FoodWebError } from '../helpers/food-web-error';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { cancelDelivery } from '../services/cancel-delivery';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';
import { DeliveryStateChangeRequest } from '../../../shared/src/interfaces/delivery/delivery-state-change-request';

const _donationHelper = new DonationHelper();
const _deliveryHelper = new DeliveryHelper();

export async function advanceDeliveryState(stateChangeReq: DeliveryStateChangeRequest, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(stateChangeReq.donationId, myAccount);
  _ensureCanAdvanceDeliveryState(donation, myAccount);
  
  let advancedDonation: DonationEntity = _genUpdateDonation(donation, 'next');
  advancedDonation = await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(advancedDonation)
  );
  await sendDeliveryStateAdvancedMessage(advancedDonation);

  saveAudit('Delivery State Advance', getAuditAccounts(advancedDonation), advancedDonation, donation, stateChangeReq.recaptchaScore);
  return advancedDonation;
}

function _ensureCanAdvanceDeliveryState(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryAdvancePrivilege(donation.delivery, donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery state advancement failed: ${errMsg}`);
  }
}

export async function undoDeliveryState(stateChangeReq: DeliveryStateChangeRequest, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(stateChangeReq.donationId, myAccount);
  _ensureCanUndoDeliveryState(donation, myAccount);

  let undoneDonation: DonationEntity = _genUpdateDonation(donation, 'prev');

  // If moving from 'Scheduled' to 'Matched', then perform delivery cancellation process.
  if (undoneDonation.donationStatus === 'Matched') {
    return cancelDelivery(donation, myAccount);
  }
  // Otherwise simply undo delivery state to a non-cancelled status.
  return _undoDeliveryStateNonCancel(stateChangeReq, donation, undoneDonation);
}

async function _undoDeliveryStateNonCancel(
  stateChangeReq: DeliveryStateChangeRequest,
  donation: DonationEntity,
  undoneDonation: Donation
): Promise<Donation> {
  undoneDonation = await getConnection().transaction
    (async (manager: EntityManager) => manager.getRepository(DonationEntity).save(undoneDonation)
  );
  await sendDeliveryStateUndoMessage(undoneDonation);
  saveAudit('Delivery State Undo', getAuditAccounts(donation), undoneDonation, donation, stateChangeReq.recaptchaScore);
  return undoneDonation;
}

function _ensureCanUndoDeliveryState(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryUndoPrivilege(donation.delivery, donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery state undo failed: ${errMsg}`);
  }
}

function _genUpdateDonation(donation: Donation, deliveryStateChangeDir: 'next' | 'prev'): DonationEntity {
  const updatedDonation: DonationEntity = Object.assign({}, <DonationEntity>donation);
  updatedDonation.donationStatus = (deliveryStateChangeDir === 'next')
    ? _donationHelper.getNextDonationStatus(updatedDonation)
    : _donationHelper.getPrevDonationStatus(updatedDonation);
  if (donation.donationStatus !== 'Unmatched') {
    updatedDonation.delivery = Object.assign({}, updatedDonation.delivery);
    _updateDeliveryTiming(updatedDonation);
  }
  return updatedDonation;
}

function _updateDeliveryTiming(donation: DonationEntity): void {
  if (donation.donationStatus === 'Scheduled') {
    donation.delivery.pickupTime = null;
  }
  if (donation.donationStatus === 'Picked Up') {
    donation.delivery.pickupTime = new Date();
    donation.delivery.dropOffTime = null;
  }
  if (donation.donationStatus === 'Complete') {
    donation.delivery.dropOffTime = new Date();
  }
}
