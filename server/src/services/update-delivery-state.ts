import { getConnection, EntityManager } from 'typeorm';
import { readDonation } from './read-donations';
import { UpdateDiff } from '../interfaces/update-diff';
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

/**
 * Advances the delivery state of a specified donation.
 * @param stateChangeReq The delivery state change request specifying the ID of the donation to have its delivery state advanced.
 * @param myAccount The account of the user submitting the delivery state advance request.
 * @return A promsie that resolves to the donation with its delivery state advanced.
 * @throws FoodWebError if the user submitting the request is not authroized to advance the delivery state.
 */
export async function advanceDeliveryState(stateChangeReq: DeliveryStateChangeRequest, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(stateChangeReq.donationId);
  _ensureCanAdvanceDeliveryState(donation, myAccount);
  
  let advancedDonation: DonationEntity = _genUpdateDonation(donation, 'next');
  advancedDonation = await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(advancedDonation)
  );

  return advancedDonation;
}

/**
 * Ensures that a given user is authroized to advance the delivery state of a given donation.
 * @param donation The donation that is to have its delivery state advanced.
 * @param account The user account that is to be checked for authorization.
 * @throws FoodWebError if the given user is not authorized to advance the delivery state of the given donation.
 */
function _ensureCanAdvanceDeliveryState(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryAdvancePrivilege(donation.delivery, donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery state advancement failed: ${errMsg}`);
  }
}

/**
 * Undoes the delivery state advancement of a specified donation.
 * @param stateChangeReq The delivery state change request specifying the ID of the donation to have its delivery state advancement undone.
 * @param myAccount The account of the user submitting the delivery state undo request.
 * @return A promsie that resolves to the donation with its delivery state undone.
 * @throws FoodWebError if the user submitting the request is not authorized to undo the delivery state advancement.
 */
export async function undoDeliveryState(
  stateChangeReq: DeliveryStateChangeRequest,
  myAccount: AccountEntity
): Promise<UpdateDiff<Donation>> {
  const donation = <DonationEntity> await readDonation(stateChangeReq.donationId);
  _ensureCanUndoDeliveryState(donation, myAccount);

  // If moving from 'Scheduled' to 'Matched', then perform delivery cancellation process, otherwise perform undo.
  const donationUpdate: DonationEntity = _genUpdateDonation(donation, 'prev');
  const undoneDonation: DonationEntity = (donationUpdate.donationStatus === 'Matched')
    ? await cancelDelivery(donation, myAccount)
    : await _undoDeliveryStateNonCancel(donationUpdate);

  return { old: donation, new: undoneDonation };
}

/**
 * Performs the undo of a delivery state advancement for a given donation.
 * @param stateChangeReq The delivery state change request specifying the ID of the donation to have its delivery state advancement undone.
 * @param donation The donation that is to have its delivery state advancement undone.
 * @param donationUpdate The donation update to apply in order to perform the delivery state undo.
 * @return A promise that resolves to the donation with its delivery state advancement undone. 
 */
async function _undoDeliveryStateNonCancel(
  donationUpdate: DonationEntity
): Promise<DonationEntity> {
  const undoneDonation: DonationEntity = await getConnection().transaction
    (async (manager: EntityManager) => manager.getRepository(DonationEntity).save(donationUpdate)
  );
  return undoneDonation;
}

/**
 * Ensures that a given user is authroized to undo the delivery state of a given donation.
 * @param donation The donation that is to have its delivery state advancement undone.
 * @param account The user account that is to be checked for authorization.
 * @throws FoodWebError if the given user is not authorized to undo the delivery state advancement of the given donation.
 */
function _ensureCanUndoDeliveryState(donation: Donation, account: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryUndoPrivilege(donation.delivery, donation.donationStatus, account);
  if (errMsg) {
    throw new FoodWebError(`Delivery state undo failed: ${errMsg}`);
  }
}

/**
 * Generates the donation upate value for a given donation that is to have its delivery state changed.
 * @param donation The donation that is to have its delivery state (and related data) updated.
 * @param deliveryStateChangeDir The direction to update the given donation's delivery state to.
 * @return The donation with its delivery state updated.
 */
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

/**
 * Updates the delivery timing data for a donation based off of its (updated) delivery state.
 * NOTE: Internally modifies the given donation!
 * @param donation The donation that is to have its delivery timing updated based off of its updated delivery state.
 */
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
