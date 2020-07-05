import { DeepPartial, EntityManager, getConnection } from 'typeorm';
import { AccountEntity, DeliveryEntity, DonationEntity } from '~entity';
import { DateTimeHelper, DateTimeRange, DeliveryHelper, DeliveryScheduleRequest, Donation, DonationStatus, ContactInfo } from '~shared';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { ScheduledDeliverySaveData, ScheduledDonationSaveData } from '~web/interfaces/delivery/scheduled-delivery-save-data';
import { readDonation } from '~web/services/donation/read-donations';
import { genMapRoute } from '~web/services/map/read-map-routes';

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
  const donationToSchedule: DonationEntity = await readDonation(scheduleRequest.donationId);
  const delivery: ScheduledDeliverySaveData = await prepareScheduledDelivery(donationToSchedule, scheduleRequest.pickupWindow, myAccount);

  const scheduleDonationUpdt: DeepPartial<DonationEntity> = await _genScheduledDonation(donationToSchedule, delivery);
  await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(scheduleDonationUpdt)
  );

  return readDonation(donationToSchedule.id);
}

/**
 * Prepares donation delivery save data for a given donation that is being scheduled.
 * Includes scheduling validation.
 * @param donationToSchedule The donation that the delivery is being generated for.
 * @param myAccount The account of the user that is scheduling the delivery.
 * @param pickupWindow The narrowed down delivery pickup window set by the volunteer scheduling the delivery.
 * @return The donation delivery save data.
 */
export async function prepareScheduledDelivery(
  donationToSchedule: Partial<Donation>,
  pickupWindow: DateTimeRange,
  myAccount: AccountEntity
): Promise<ScheduledDeliverySaveData> {
  _ensureCanScheduleDelivery(donationToSchedule, myAccount);
  const delivery: ScheduledDeliverySaveData = new DeliveryEntity();
  const donorContactInfo: ContactInfo = (donationToSchedule.donorContactOverride)
    ? donationToSchedule.donorContactOverride
    : donationToSchedule.donorAccount.contactInfo;
  delivery.volunteerAccount = myAccount;
  delivery.pickupWindowStart = pickupWindow.startDateTime;
  delivery.pickupWindowEnd = pickupWindow.endDateTime;
  delivery.routeToDonor = await genMapRoute(myAccount.contactInfo, donorContactInfo);
  delivery.dropOffWindowStart = _dateTimeHelper.addMinutes(pickupWindow.startDateTime, delivery.routeToDonor.durationMin);
  delivery.dropOffWindowEnd = _dateTimeHelper.addMinutes(delivery.dropOffWindowStart, 30);
  return delivery;
}

/**
 * Ensures that a given user can schedule the delivery of a given donation.
 * @param donation The donation that shall be scheduled for delivery.
 * @param myAccount The account of the user who is scheduling the delivery.
 * @throws FoodWebError if the donation delivery cannot be scheduled.
 */
function _ensureCanScheduleDelivery(donation: Partial<Donation>, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliverySchedulePrivilege(donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery scheduling failed: ${errMsg}`);
  }
}

/**
 * Generates scheduled donation save data based on a given donation to schedule and its new delivery data.
 * @param donationToSchedule The donation that is to be scheduled.
 * @param delivery The scheduled delivery save data.
 * @return The scheduled donation save data.
 */
async function _genScheduledDonation(donationToSchedule: DonationEntity, delivery: ScheduledDeliverySaveData): Promise<ScheduledDonationSaveData> {
  // Make shallow copy to preserve original donation.
  return {
    id: donationToSchedule.id,
    donationStatus: DonationStatus.Scheduled,
    claim: {
      id: donationToSchedule.claim.id,
      delivery
    }
  };
}
