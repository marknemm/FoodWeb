import { plainToClass } from 'class-transformer';
import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity, DeliveryEntity, DonationEntity } from '~entity';
import { DateTimeHelper, DeliveryHelper, DeliveryStateChangeRequest, DonationHelper, DonationStatus } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { FoodWebError } from '~web/helpers/response/foodweb-error';
import { DeliveryStatusChangeSaveData, DonationStatusChangeSaveData } from '~web/interfaces/delivery/delivery-status-change-save-data';
import { cancelDelivery } from '~web/services/delivery/cancel-delivery';
import { readDonation } from '~web/services/donation/read-donations';

const _donationHelper = new DonationHelper();
const _deliveryHelper = new DeliveryHelper();
const _dateTimeHelper = new DateTimeHelper();

/**
 * Advances the delivery state of a specified donation.
 * @param stateChangeReq The delivery state change request specifying the ID of the donation to have its delivery state advanced.
 * @param myAccount The account of the user submitting the delivery state advance request.
 * @return A promise that resolves to the donation with its delivery state advanced.
 * @throws FoodWebError if the user submitting the request is not authorized to advance the delivery state.
 */
export async function advanceDeliveryState(stateChangeReq: DeliveryStateChangeRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donationToAdvance = <DonationEntity> await readDonation(stateChangeReq.donationId);
  const advancedDelivery: DeliveryStatusChangeSaveData = prepareAdvancedDelivery(donationToAdvance, myAccount);
  const advancedDonation: DonationStatusChangeSaveData = _genDonationUpdate(donationToAdvance, advancedDelivery, 'next');
  return _saveDonationStatusUpdate(advancedDonation);
}

/**
 * Prepares a delivery update consisting of delivery status change save data.
 * @param donationToAdvance The original donation that is to have its delivery (donation) status advanced.
 * @param myAccount The account of the volunteer that is advancing the status of their delivery.
 * @return The delivery update.
 */
export function prepareAdvancedDelivery(donationToAdvance: DonationEntity, myAccount: AccountEntity): DeliveryStatusChangeSaveData {
  _ensureCanAdvanceDeliveryState(donationToAdvance, myAccount);
  const donationStatusUpdt: DonationStatus = _donationHelper.getNextDonationStatus(donationToAdvance);
  return _genDeliveryUpdate(donationToAdvance, donationStatusUpdt);
}

/**
 * Ensures that a given user is authorized to advance the delivery state of a given donation.
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
 * @return A promise that resolves to the donation with its delivery state undone.
 * @throws FoodWebError if the user submitting the request is not authorized to undo the delivery state advancement.
 */
export async function undoDeliveryState(
  stateChangeReq: DeliveryStateChangeRequest,
  myAccount: AccountEntity
): Promise<UpdateDiff<DonationEntity>> {
  const donationToUndo = <DonationEntity> await readDonation(stateChangeReq.donationId);

  // If moving from 'Scheduled' to 'Matched', then perform delivery cancellation process, otherwise perform undo.
  const undoneDelivery: DeliveryStatusChangeSaveData = prepareUndoneDelivery(donationToUndo, myAccount);
  const undoneDonation: DonationStatusChangeSaveData = _genDonationUpdate(donationToUndo, undoneDelivery, 'prev');
  const newDonation: DonationEntity = (undoneDonation.donationStatus === DonationStatus.Matched)
    ? await cancelDelivery(donationToUndo, myAccount)
    : await _saveDonationStatusUpdate(undoneDonation);

  return { old: donationToUndo, new: newDonation };
}

/**
 * Prepares a delivery update consisting of delivery status change save data.
 * @param donationToAdvance The original donation that is to have its delivery (donation) status undone.
 * @param myAccount The account of the volunteer that is undoing the status of their delivery.
 * @return The delivery update.
 */
export function prepareUndoneDelivery(donationToUndo: DonationEntity, myAccount: AccountEntity): DeliveryStatusChangeSaveData {
  _ensureCanUndoDeliveryState(donationToUndo, myAccount);
  const donationStatusUpdt: DonationStatus = _donationHelper.getPrevDonationStatus(donationToUndo);
  return _genDeliveryUpdate(donationToUndo, donationStatusUpdt);
}

/**
 * Saves a given donation update consisting of donation/delivery status change data.
 * @param donationUpdt The donation update to save.
 * @return A promise that resolves to the donation with its delivery (donation) status updated.
 */
async function _saveDonationStatusUpdate(
  donationUpdt: DonationStatusChangeSaveData
): Promise<DonationEntity> {
  await getConnection().transaction(
    (manager: EntityManager) => manager.getRepository(DonationEntity).save(
      plainToClass(DonationEntity, donationUpdt)
    )
  );
  return readDonation(donationUpdt.id);
}

/**
 * Ensures that a given user is authorized to undo the delivery state of a given donation.
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
 * Generates a delivery update consisting of delivery status change save data.
 * @param originalDonation The original donation that the update is being generated for.
 * @param donationStatusUpdt The donation status update.
 * @return The generated delivery update.
 */
function _genDeliveryUpdate(originalDonation: DonationEntity, donationStatusUpdt: DonationStatus): DeliveryStatusChangeSaveData {
  const delivery: DeliveryStatusChangeSaveData = new DeliveryEntity();
  delivery.id = originalDonation.claim.delivery.id;
  const now = new Date();
  switch (donationStatusUpdt) {
    case DonationStatus.Matched:
    case DonationStatus.Scheduled:
      delivery.startTime = null;
      delivery.pickupTime = null;
      delivery.dropOffTime = null;
      break;
    case DonationStatus.Started:
      delivery.startTime = now;
      delivery.pickupTime = null;
      delivery.dropOffTime = null;
      delivery.pickupWindowStart = _dateTimeHelper.addMinutes(now, originalDonation.claim.delivery.routeToDonor.durationMin);
      delivery.pickupWindowEnd = _dateTimeHelper.addMinutes(<Date>delivery.pickupWindowStart, 15);
      delivery.dropOffWindowStart =
        _dateTimeHelper.addMinutes(<Date>delivery.pickupWindowStart, originalDonation.claim.routeToReceiver.durationMin);
      delivery.dropOffWindowEnd = _dateTimeHelper.addMinutes(<Date>delivery.dropOffWindowStart, 30);
      break;
    case DonationStatus.PickedUp:
      delivery.pickupTime = now;
      delivery.dropOffTime = null;
      delivery.dropOffWindowStart = _dateTimeHelper.addMinutes(now, originalDonation.claim.routeToReceiver.durationMin);
      delivery.dropOffWindowEnd = _dateTimeHelper.addMinutes(<Date>delivery.dropOffWindowStart, 15);
      break;
    case DonationStatus.Complete:
      delivery.dropOffTime = now;
      break;
    default:
      throw new FoodWebError(`Updating delivery timing for incorrect donation status update: ${donationStatusUpdt}`);
  }
  return delivery;
}

/**
 * Generates a donation update consisting of donation/delivery status change save data.
 * @param originalDonation The original donation for which to generate donation status change save data.
 * @param delivery The delivery update consisting of delivery status change save data.
 * @param updateDirection The direction to update the given donation's delivery state to.
 * @return The donation update that is to be saved.
 */
function _genDonationUpdate(
  originalDonation: DonationEntity,
  delivery: DeliveryStatusChangeSaveData,
  updateDirection: 'next' | 'prev'
): DonationStatusChangeSaveData {
  const donation: DonationStatusChangeSaveData = {
    id: originalDonation.id,
    donationStatus: (updateDirection === 'next')
      ? _donationHelper.getNextDonationStatus(originalDonation)
      : _donationHelper.getPrevDonationStatus(originalDonation),
    claim: {
      id: originalDonation.claim.id,
      delivery
    }
  };
  return donation;
}
