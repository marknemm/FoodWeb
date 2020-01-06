import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DeliveryEntity } from '../entity/delivery-entity';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { DateTimeHelper, Delivery, DeliveryHelper, DeliveryScheduleRequest, Donation, DonationStatus, MapRoute } from '../shared';
import { genMapRoute } from './gen-map-route';
import { readDonation } from './read-donations';

const _deliveryHelper = new DeliveryHelper();
const _dateTimeHelper = new DateTimeHelper();

/**
 * Schedules the delivery of a donation.
 * @param scheduleRequest The delivery schedule request.
 * @param myAccount The account of the current user that is submitting the schedule request.
 * @return A promise that resolves to the donation that has had its delivery scheduled.
 * @throws FoodWebError if the user that submitted the request is not authroized to schedule the delivery.
 */
export async function scheduleDelivery(scheduleRequest: DeliveryScheduleRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donationToSchedule: Donation = await readDonation(scheduleRequest.donationId);
  _ensureCanScheduleDelivery(donationToSchedule, myAccount);

  const scheduleDonationUpdt: Partial<DonationEntity> = await _genScheduleDonationUpdt(donationToSchedule, myAccount, scheduleRequest);
  await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(scheduleDonationUpdt)
  );

  return readDonation(donationToSchedule.id);
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
async function _genScheduleDonationUpdt(
  donationToSchedule: Donation,
  myAccount: AccountEntity,
  scheduleRequest: DeliveryScheduleRequest
): Promise<Partial<DonationEntity>> {
  // Make shallow copy to preserve original donation.
  const scheduleDonationUpdt: Partial<DonationEntity> = { id: donationToSchedule.id };
  scheduleDonationUpdt.donationStatus = DonationStatus.Scheduled;
  scheduleDonationUpdt.delivery = <DeliveryEntity> await _genDonationDelivery(donationToSchedule, myAccount, scheduleRequest);
  return scheduleDonationUpdt;
}

/**
 * Generates a donation delivery for a given donation that is being scheduled.
 * @param donation The donation that the delivery is being generated for.
 * @param myAccount The account of the user that is scheduling the delivery.
 * @param scheduleRequest The donation schedule request issued by the user's web/app client.
 * @return The donation delivery.
 */
async function _genDonationDelivery(
  donation: Donation,
  myAccount: AccountEntity,
  scheduleRequest: DeliveryScheduleRequest
): Promise<Delivery> {
  const routeToDonor: MapRoute = await genMapRoute(myAccount.contactInfo, donation.donorContactOverride);
  return {
    volunteerAccount: myAccount,
    pickupWindowStart: scheduleRequest.pickupWindow.startDateTime,
    pickupWindowEnd: scheduleRequest.pickupWindow.endDateTime,
    dropOffWindowStart: _dateTimeHelper.addMinutes(scheduleRequest.pickupWindow.startDateTime, routeToDonor.durationMin),
    dropOffWindowEnd: _dateTimeHelper.addMinutes(scheduleRequest.pickupWindow.endDateTime, routeToDonor.durationMin),
    routeToDonor
  };
}
