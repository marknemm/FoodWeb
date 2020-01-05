import { EntityManager, getConnection, DeepPartial } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { UpdateDiff } from '../interfaces/update-diff';
import { cancelDelivery } from '../services/cancel-delivery';
import { DeliveryHelper, DeliveryStateChangeRequest, Donation, DonationHelper, DonationStatus } from '../shared';
import { readDonation } from './read-donations';

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

  const advanceDonationUpdt: DeepPartial<DonationEntity> = _genDonationStateUpdate(donation, 'next');
  await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(advanceDonationUpdt)
  );

  return readDonation(donation.id);
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
  const undoDonationUpdt: DeepPartial<DonationEntity> = _genDonationStateUpdate(donation, 'prev');
  const undoneDonation: DonationEntity = (undoDonationUpdt.donationStatus === DonationStatus.Matched)
    ? await cancelDelivery(donation, myAccount)
    : await _undoDeliveryStateNonCancel(undoDonationUpdt);

  return { old: donation, new: undoneDonation };
}

/**
 * Performs the undo of a delivery state advancement for a given donation.
 * @param stateChangeReq The delivery state change request specifying the ID of the donation to have its delivery state advancement undone.
 * @param donation The donation that is to have its delivery state advancement undone.
 * @param undoDonationUpdt The donation update to apply in order to perform the delivery state undo.
 * @return A promise that resolves to the donation with its delivery state advancement undone. 
 */
async function _undoDeliveryStateNonCancel(
  undoDonationUpdt: DeepPartial<DonationEntity>
): Promise<DonationEntity> {
  await getConnection().transaction
    (async (manager: EntityManager) => manager.getRepository(DonationEntity).save(undoDonationUpdt)
  );
  return readDonation(undoDonationUpdt.id);
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
 * Generates the donation update value for a given donation that is to have its delivery state changed.
 * @param donation The donation that is to have its delivery state (and related data) updated.
 * @param deliveryStateChangeDir The direction to update the given donation's delivery state to.
 * @return The donation state update data that should be saved.
 */
function _genDonationStateUpdate(donation: Donation, deliveryStateChangeDir: 'next' | 'prev'): DeepPartial<DonationEntity> {
  const updatedDonation: DeepPartial<DonationEntity> = { id: donation.id };
  updatedDonation.donationStatus = (deliveryStateChangeDir === 'next')
    ? _donationHelper.getNextDonationStatus(donation.donationStatus)
    : _donationHelper.getPrevDonationStatus(donation.donationStatus);
  if (donation.donationStatus !== DonationStatus.Unmatched) {
    updatedDonation.delivery = { id: donation.delivery.id };
    _updateDeliveryTiming(updatedDonation);
  }
  return updatedDonation;
}

/**
 * Updates the delivery timing data for a donation based off of its (updated) delivery state.
 * NOTE: Internally modifies the given donation update object!
 * @param donationUpdt The donation update that is to have its delivery timing updated based off of its updated delivery state.
 */
function _updateDeliveryTiming(donationUpdt: DeepPartial<DonationEntity>): void {
  switch (donationUpdt.donationStatus) {
    case DonationStatus.Scheduled:
      donationUpdt.delivery.startTime = null;
      donationUpdt.delivery.pickupTime = null;
      donationUpdt.delivery.dropOffTime = null;
      break;
    case DonationStatus.Started:
      donationUpdt.delivery.startTime = new Date();
      donationUpdt.delivery.pickupTime = null;
      donationUpdt.delivery.dropOffTime = null;
      break;
    case DonationStatus.PickedUp:
      donationUpdt.delivery.pickupTime = new Date();
      donationUpdt.delivery.dropOffTime = null;
      break;
    case DonationStatus.Complete:
      donationUpdt.delivery.dropOffTime = new Date();
      break;
  }
}
