import { DeepPartial, EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../../entity/account.entity';
import { DonationEntity } from '../../entity/donation.entity';
import { FoodWebError } from '../../helpers/response/food-web-error';
import { UpdateDiff } from '../../interfaces/update-diff';
import { DateTimeHelper, DeliveryHelper, DeliveryStateChangeRequest, DonationHelper, DonationStatus } from '../../shared';
import { readDonation } from '../donation/read-donations';
import { cancelDelivery } from './cancel-delivery';

const _donationHelper = new DonationHelper();
const _deliveryHelper = new DeliveryHelper();
const _dateTimeHelper = new DateTimeHelper();

/**
 * Advances the delivery state of a specified donation.
 * @param stateChangeReq The delivery state change request specifying the ID of the donation to have its delivery state advanced.
 * @param myAccount The account of the user submitting the delivery state advance request.
 * @return A promsie that resolves to the donation with its delivery state advanced.
 * @throws FoodWebError if the user submitting the request is not authroized to advance the delivery state.
 */
export async function advanceDeliveryState(stateChangeReq: DeliveryStateChangeRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donation = <DonationEntity> await readDonation(stateChangeReq.donationId);
  _ensureCanAdvanceDeliveryState(donation, myAccount);

  const advanceDonationUpdt: DeepPartial<DonationEntity> = _genDonationUpdate(donation, 'next');
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
function _ensureCanAdvanceDeliveryState(donation: DonationEntity, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryAdvancePrivilege(donation.claim.delivery, donation.donationStatus, myAccount);
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
): Promise<UpdateDiff<DonationEntity>> {
  const donation = <DonationEntity> await readDonation(stateChangeReq.donationId);
  _ensureCanUndoDeliveryState(donation, myAccount);

  // If moving from 'Scheduled' to 'Matched', then perform delivery cancellation process, otherwise perform undo.
  const undoDonationUpdt: DeepPartial<DonationEntity> = _genDonationUpdate(donation, 'prev');
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
function _ensureCanUndoDeliveryState(donation: DonationEntity, account: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryUndoPrivilege(donation.claim.delivery, donation.donationStatus, account);
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
function _genDonationUpdate(donation: DonationEntity, deliveryStateChangeDir: 'next' | 'prev'): DeepPartial<DonationEntity> {
  const donationUpdate: DeepPartial<DonationEntity> = { id: donation.id };
  donationUpdate.donationStatus = (deliveryStateChangeDir === 'next')
    ? _donationHelper.getNextDonationStatus(donation.donationStatus)
    : _donationHelper.getPrevDonationStatus(donation.donationStatus);
  if (donation.donationStatus !== DonationStatus.Unmatched) {
    donationUpdate.claim = { id: donation.claim.id };
    donationUpdate.claim.delivery = { id: donation.claim.delivery.id };
    _updateDeliveryTiming(donation, donationUpdate);
  }
  return donationUpdate;
}

/**
 * Updates the delivery timing data for a donation based off of its (updated) delivery state.
 * NOTE: Internally modifies the given donation update object!
 * @param donation The donation that the update is being generated for.
 * @param donationUpdt The donation update that is to have its delivery timing updated based off of its updated delivery state.
 */
function _updateDeliveryTiming(donation: DonationEntity, donationUpdt: DeepPartial<DonationEntity>): void {
  const now = new Date();
  switch (donationUpdt.donationStatus) {
    case DonationStatus.Matched:
    case DonationStatus.Scheduled:
      donationUpdt.claim.delivery.startTime = null;
      donationUpdt.claim.delivery.pickupTime = null;
      donationUpdt.claim.delivery.dropOffTime = null;
      break;
    case DonationStatus.Started:
      donationUpdt.claim.delivery.startTime = now;
      donationUpdt.claim.delivery.pickupTime = null;
      donationUpdt.claim.delivery.dropOffTime = null;
      donationUpdt.claim.delivery.pickupWindowStart = _dateTimeHelper.addMinutes(now, donation.claim.delivery.routeToDonor.durationMin);
      donationUpdt.claim.delivery.pickupWindowEnd = _dateTimeHelper.addMinutes(<Date>donationUpdt.claim.delivery.pickupWindowStart, 15);
      donationUpdt.claim.delivery.dropOffWindowStart =
        _dateTimeHelper.addMinutes(<Date>donationUpdt.claim.delivery.pickupWindowStart, donation.claim.routeToReceiver.durationMin);
      donationUpdt.claim.delivery.dropOffWindowEnd = _dateTimeHelper.addMinutes(<Date>donationUpdt.claim.delivery.dropOffWindowStart, 30);
      break;
    case DonationStatus.PickedUp:
      donationUpdt.claim.delivery.pickupTime = now;
      donationUpdt.claim.delivery.dropOffTime = null;
      donationUpdt.claim.delivery.dropOffWindowStart = _dateTimeHelper.addMinutes(now, donation.claim.routeToReceiver.durationMin);
      donationUpdt.claim.delivery.dropOffWindowEnd = _dateTimeHelper.addMinutes(<Date>donationUpdt.claim.delivery.dropOffWindowStart, 15);
      break;
    case DonationStatus.Complete:
      donationUpdt.claim.delivery.dropOffTime = now;
      break;
    default:
      throw new FoodWebError(`Updating delivery timing for incorrect donation status update: ${donationUpdt.donationStatus}`);
  }
}
