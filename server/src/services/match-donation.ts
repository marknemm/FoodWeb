import { getConnection, EntityManager } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { readAccounts, AccountsQueryResult } from './read-accounts';
import { readDonation } from './read-donations';
import { sendMatchRequestMessage, sendClaimMessages, sendUnclaimMessages } from './match-donation-message';
import { cancelDelivery } from './cancel-delivery';
import { saveAudit, getAuditAccounts } from './save-audit';
import { FoodWebError } from '../helpers/food-web-error';
import { DonationEntity } from '../entity/donation.entity';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { Account } from '../../../shared/src/interfaces/account/account';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DonationClaimRequest } from '../../../shared/src/interfaces/donation/donation-claim-request';
import { DonationUnclaimRequest } from '../../../shared/src/interfaces/donation/donation-unclaim-request';
import { DateTimeRange } from '../../../shared/src/interfaces/misc/time';

const _donationHelper = new DonationHelper();

/**
 * Sends messages to potential receiver charities so that they are given a chance to claim the donation.
 * @param donation The donation that is up for claim.
 * @return A promise that resolves to void when the operation is finished.
 */
export async function messagePotentialReceivers(donation: Donation): Promise<void> {
  const potentialReceivers: AccountEntity[] = await _findPotentialReceivers(donation);
  const messagePromises: Promise<void>[] = [];
  potentialReceivers.forEach((receiver: AccountEntity) => {
    const promise: Promise<void> = sendMatchRequestMessage(donation, receiver);
    messagePromises.push(promise);
  });
  await Promise.all(messagePromises).catch(console.error);
}

/**
 * Gets all potential receivers for a donation so that they can be messaged for a chance to claim the donation.
 * @return A promise that resolves to the list of potential receiver accounts.
 */
async function _findPotentialReceivers(donation: Donation): Promise<AccountEntity[]> {
  const operationHoursRange: DateTimeRange = {
    startDateTime: donation.pickupWindowStart,
    endDateTime: donation.pickupWindowEnd
  };
  const readRequest: AccountReadRequest = { page: 1, limit: 300, accountType: 'Receiver', operationHoursRange };
  const queryResult: AccountsQueryResult = await readAccounts(readRequest, donation.donorAccount);
  return queryResult.accounts;
}

/**
 * Claims a donation.
 * @param claimReq The donation claim request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise that resolves to the donation after it has been claimed.
 */
export async function claimDonation(claimReq: DonationClaimRequest, myAccount: AccountEntity): Promise<Donation> {
  const donationToClaim: Donation = await readDonation(claimReq.donationId, myAccount);
  _ensureCanClaimDonation(donationToClaim, myAccount);

  let claimedDonation: Donation = Object.assign({}, donationToClaim);
  claimedDonation.donationStatus = 'Matched';
  claimedDonation.receiverAccount = myAccount;

  claimedDonation = await getConnection().transaction(async (manager: EntityManager) =>
    manager.getRepository(DonationEntity).save(claimedDonation)
  );
  await sendClaimMessages(claimedDonation);

  saveAudit('Claim Donation', getAuditAccounts(claimedDonation), claimedDonation, donationToClaim, claimReq.recaptchaScore);
  return claimedDonation;
}

function _ensureCanClaimDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationClaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation claim failed: ${errMsg}`);
  }
}

/**
 * Unclaims a donation.
 * @param unclaimReq The unclaim donation request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise resolving to the donation after it has been unclaimed.
 */
export async function unclaimDonation(unclaimReq: DonationUnclaimRequest, myAccount: AccountEntity): Promise<Donation> {
  const donationToUnclaim: Donation = await readDonation(unclaimReq.donationId, myAccount);
  _ensureCanUnclaimDonation(donationToUnclaim, myAccount);

  let unclaimedDonation: Donation = Object.assign({}, donationToUnclaim);
  await getConnection().transaction(async (manager: EntityManager) => {
    unclaimedDonation = await _cancelDeliveryIfExists(unclaimedDonation, myAccount, manager);
    unclaimedDonation.donationStatus = 'Unmatched';
    unclaimedDonation.receiverAccount = null;
    unclaimedDonation = await manager.getRepository(DonationEntity).save(unclaimedDonation);
  });
  await sendUnclaimMessages(unclaimedDonation, donationToUnclaim);

  saveAudit('Unclaim Donation', getAuditAccounts(donationToUnclaim), unclaimedDonation, donationToUnclaim, unclaimReq.recaptchaScore);
  return unclaimedDonation;
}

function _ensureCanUnclaimDonation(donation: Donation, myAccount: Account): void {
  const errMsg: string = _donationHelper.validateDonationUnclaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation unclaim failed: ${errMsg}`);
  }
}

async function _cancelDeliveryIfExists(donation: Donation, myAccount: AccountEntity, manager: EntityManager): Promise<Donation> {
  // If delivery exists, then cancel any associated delivery (without sending cancellation message).
  return (donation.delivery)
    ? await cancelDelivery(donation, myAccount, manager)
    : donation;
}
