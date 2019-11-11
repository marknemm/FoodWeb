import { getConnection, EntityManager } from 'typeorm';
import { readDonation } from './read-donations';
import { FoodWebError } from '../helpers/food-web-error';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { Donation, DonationStatus } from '../shared';
import { DeliveryScheduleRequest } from '../shared';
import { DeliveryHelper } from '../shared';

const _deliveryHelper = new DeliveryHelper();

/**
 * Schedules the delivery of a donation.
 * @param scheduleRequest The delivery schedule request.
 * @param myAccount The account of the current user that is submitting the schedule request.
 * @return A promise that resolves to the donation that has had its delivery scheduled.
 * @throws FoodWebError if the user that submitted the request is not authroized to schedule the delivery.
 */
export async function scheduleDelivery(scheduleRequest: DeliveryScheduleRequest, myAccount: AccountEntity): Promise<Donation> {
  const donationToSchedule = <DonationEntity> await readDonation(scheduleRequest.donationId);
  _ensureCanScheduleDelivery(donationToSchedule, myAccount);

  let scheduledDonation: DonationEntity = _genScheduledDonation(myAccount, donationToSchedule, scheduleRequest);
  scheduledDonation = await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(scheduledDonation)
  );
  delete scheduledDonation.delivery.donation; // Prevent circular JSON reference error.

  return scheduledDonation;
}

function _ensureCanScheduleDelivery(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliverySchedulePrivilege(donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery scheduling failed: ${errMsg}`);
  }
}

function _genScheduledDonation(
  myAccount: AccountEntity,
  donationToSchedule: DonationEntity,
  scheduleRequest: DeliveryScheduleRequest
): DonationEntity {
  // Make shallow copy to preserve original donation.
  let scheduledDonation: DonationEntity = Object.assign({}, donationToSchedule);
  scheduledDonation.donationStatus = DonationStatus.Scheduled;
  scheduledDonation.delivery = {
    id: undefined,
    volunteerAccount: myAccount,
    pickupWindowStart: scheduleRequest.pickupWindow.startDateTime,
    pickupWindowEnd: scheduleRequest.pickupWindow.endDateTime,
    donation: donationToSchedule
  };
  return scheduledDonation;
}
