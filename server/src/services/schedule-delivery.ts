import { getConnection, EntityManager } from 'typeorm';
import { readAccounts, AccountsQueryResult } from './read-accounts';
import { sendDeliveryRequestMessages } from './schedule-delivery-message';
import { readDonation } from './read-donations';
import { FoodWebError } from '../helpers/food-web-error';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { Donation, DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { DeliveryScheduleRequest } from '../../../shared/src/interfaces/delivery/delivery-schedule-request';
import { AccountType } from '../../../shared/src/interfaces/account/account';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';

const _deliveryHelper = new DeliveryHelper();

/**
 * Sends messages to potential volunteer deliverers so that they are notified about the need for donation delivery.
 * @param donation The donation that has been matched and needs to be delivered.
 * @return A promise that resolves to the input donation when complete.
 */
export async function messagePotentialDeliverers(donation: Donation): Promise<Donation> {
  const potentialDeliverers: AccountEntity[] = await _findPotentialDeliverers(donation);
  const messagePromises: Promise<void>[] = [];
  potentialDeliverers.forEach((deliverer: AccountEntity) => {
    const promise: Promise<void> = sendDeliveryRequestMessages(donation, deliverer);
    messagePromises.push(promise);
  });
  await Promise.all(messagePromises).catch(console.error);
  return donation;
}

/**
 * Gets all potential deliverers for a donation so that they can be messaged for a chance to begin/schedule the delivery.
 * @return A promise that resolves to the list of potential receiver accounts.
 */
async function _findPotentialDeliverers(donation: Donation): Promise<AccountEntity[]> {
  const readRequest: AccountReadRequest = {
    page: 1,
    limit: 300,
    accountType: AccountType.Volunteer,
    distanceRangeMi: 20,
    operationHoursRange: {
      startDateTime: donation.pickupWindowStart,
      endDateTime: donation.pickupWindowEnd
    }
  };
  const queryResult: AccountsQueryResult = await readAccounts(readRequest);
  return queryResult.accounts;
}

/**
 * Schedules the delivery of a donation.
 * @param scheduleRequest The delivery schedule request.
 * @param myAccount The account of the current user that is submitting the schedule request.
 * @return A promise that resolves to the donation that has had its delivery scheduled.
 * @throws FoodWebError if the user that submitted the request is not authroized to schedule the delivery.
 */
export async function scheduleDelivery(scheduleRequest: DeliveryScheduleRequest, myAccount: AccountEntity): Promise<Donation> {
  const donationToSchedule = <DonationEntity> await readDonation(scheduleRequest.donationId, myAccount);
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
