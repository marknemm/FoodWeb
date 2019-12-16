import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { getDirections } from '../helpers/directions';
import { FoodWebError } from '../helpers/food-web-error';
import { Delivery, DeliveryHelper, DeliveryScheduleRequest, Directions, Donation, DonationStatus } from '../shared';
import { readDonation } from './read-donations';

const _deliveryHelper = new DeliveryHelper();

/**
 * Schedules the delivery of a donation.
 * @param scheduleRequest The delivery schedule request.
 * @param myAccount The account of the current user that is submitting the schedule request.
 * @return A promise that resolves to the donation that has had its delivery scheduled.
 * @throws FoodWebError if the user that submitted the request is not authroized to schedule the delivery.
 */
export async function scheduleDelivery(scheduleRequest: DeliveryScheduleRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  let donationToSchedule: Donation = await readDonation(scheduleRequest.donationId);
  _ensureCanScheduleDelivery(donationToSchedule, myAccount);

  donationToSchedule = await _genScheduledDonation(donationToSchedule, myAccount, scheduleRequest);
  const scheduledDonation: DonationEntity = await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(scheduledDonation)
  );
  delete scheduledDonation.delivery.donation; // Prevent circular JSON reference error.

  return scheduledDonation;
}

/**
 * Ensures that a given user can schedule the delivery of a given donation.
 * @param donation The donation that shall be scheduled for delivery.
 * @param myAccount The account of the user who is scheduling the delivery.
 * @throws FoodWebError if the donation delivery cannot be scheduled.
 */
function _ensureCanScheduleDelivery(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliverySchedulePrivilege(donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery scheduling failed: ${errMsg}`);
  }
}

/**
 * Generates a scheduled donation based on a given donation.
 * @param donationToSchedule The donation that is to be scheduled.
 * @param myAccount The account of the user who is scheduling the donation.
 * @param scheduleRequest The donation schedule request issued by the user's web/app client.
 * @return The scheduled donation.
 */
async function _genScheduledDonation(
  donationToSchedule: Donation,
  myAccount: AccountEntity,
  scheduleRequest: DeliveryScheduleRequest
): Promise<Donation> {
  // Make shallow copy to preserve original donation.
  const scheduledDonation: Donation = Object.assign({}, donationToSchedule);
  scheduledDonation.donationStatus = DonationStatus.Scheduled;
  scheduledDonation.delivery = await _genDonationDelivery(donationToSchedule, myAccount, scheduleRequest);
  return scheduledDonation;
}

/**
 * Generates a donation delivery for a given donation that is being scheduled.
 * @param donationToSchedule The donation that the delivery is being generated for.
 * @param myAccount The account of the user that is scheduling the delivery.
 * @param scheduleRequest The donation schedule request issued by the user's web/app client.
 * @return The donation delivery.
 */
async function _genDonationDelivery(
  donationToSchedule: Donation,
  myAccount: AccountEntity,
  scheduleRequest: DeliveryScheduleRequest
): Promise<Delivery> {
  const directions: Directions = await getDirections([
    myAccount.contactInfo,
    donationToSchedule.donorContactOverride
  ]);

  return {
    volunteerAccount: myAccount,
    pickupWindowStart: scheduleRequest.pickupWindow.startDateTime,
    pickupWindowEnd: scheduleRequest.pickupWindow.endDateTime,
    distanceMiToDonor: directions.distanceMi,
    durationMinToDonor: directions.durationMin,
    directionsToDonor: directions
  };
}
