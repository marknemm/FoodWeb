import { getConnection, EntityManager } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { readAccounts, AccountsQueryResult } from './read-accounts';
import { sendEmail, MailTransporter, broadcastEmail } from '../helpers/email';
import { FoodWebError } from '../helpers/food-web-error';
import { readDonation } from './read-donations';
import { DonationEntity } from '../entity/donation.entity';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { Account } from '../../../shared/src/interfaces/account/account';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { cancelDelivery } from './cancel-delivery';

const _donationHelper = new DonationHelper();

/**
 * Sends messages to potential receiver charities so that they are given a chance to claim the donation.
 * @param donation The donation that is up for claim.
 * @return A promise that resolves to void when the operation is finished.
 */
export async function messagePotentialReceivers(donation: Donation): Promise<void> {
  const potentialReceivers: AccountEntity[] = await _findPotentialReceivers();
  const messagePromises: Promise<void>[] = [];
  potentialReceivers.forEach((receiver: AccountEntity) => {
    const promise: Promise<void> = _sendMatchRequestMessage(donation, receiver);
    messagePromises.push(promise);
  });
  await Promise.all(messagePromises);
}

/**
 * Gets all potential receivers for a donation so that they can be messaged for a chance to claim the donation.
 * @return A promise that resolves to the list of potential receiver accounts.
 */
async function _findPotentialReceivers(): Promise<AccountEntity[]> {
  const readRequest: AccountReadRequest = { page: 1, limit: 300, accountType: 'Receiver' };
  const queryResult: AccountsQueryResult = await readAccounts(readRequest);
  return queryResult.accounts;
}

/**
 * Messages a potential receiver so that they may be aware of a new donation and potentially claim it.
 * @param donation The new donation.
 * @param receiver The receiver account.
 * @return A promise that resolves to void once the email has been sent.
 */
function _sendMatchRequestMessage(donation: Donation, receiver: AccountEntity): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    receiver,
    `Donation Available From ${_donationHelper.donorName(donation)}`,
    'donation-match-request',
    { donation }
  );
}

export async function claimDonation(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donationToClaim: Donation = await readDonation(donationId);
  _ensureCanClaimDonation(donationToClaim, myAccount);
  donationToClaim.donationStatus = 'Matched';
  donationToClaim.receiverAccount = myAccount;

  let claimedDonation: Donation;
  await getConnection().transaction(async (manager: EntityManager) => {
    claimedDonation = await manager.getRepository(DonationEntity).save(donationToClaim);
    await _sendClaimMessages(claimedDonation);
  });
  return claimedDonation;
}

function _ensureCanClaimDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationClaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation claim failed: ${errMsg}`);
  }
}

async function _sendClaimMessages(donation: Donation): Promise<void> {
  const accounts: Account[] = [donation.receiverAccount, donation.donorAccount];
  const { donorName, receiverName } = _donationHelper.memberNames(donation);
  const subjects = [
    `Claimed Donation from ${donorName}`,
    `Donation Claimed by ${receiverName}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    accounts,
    subjects,
    'donation-claimed',
    { donation, donorName, receiverName }
  )
}

export async function unclaimDonation(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donationToUnclaim: Donation = await readDonation(donationId);
  const receiver: Account = donationToUnclaim.receiverAccount;
  _ensureCanUnclaimDonation(donationToUnclaim, myAccount);
  donationToUnclaim.donationStatus = 'Unmatched';
  donationToUnclaim.receiverAccount = null;

  let unclaimedDonation: Donation;
  await getConnection().transaction(async (manager: EntityManager) => {
    unclaimedDonation = await manager.getRepository(DonationEntity).save(donationToUnclaim);
    const deliverer: Account = await _cancelDeliveryIfExists(unclaimedDonation, myAccount, manager);
    await _sendUnclaimMessages(unclaimedDonation, receiver, deliverer);
  });
  return unclaimedDonation;
}

function _ensureCanUnclaimDonation(donation: Donation, myAccount: Account): void {
  const errMsg: string = _donationHelper.validateDonationUnclaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation unclaim failed: ${errMsg}`);
  }
}

async function _cancelDeliveryIfExists(unclaimedDonation: Donation, myAccount: AccountEntity, manager: EntityManager): Promise<Account> {
  let deliverer: Account;
  // If delivery exists, then cancel any associated delivery (without sending cancellation message).
  if (unclaimedDonation.delivery) {
    deliverer = unclaimedDonation.delivery.volunteerAccount;
    unclaimedDonation = await cancelDelivery(unclaimedDonation, myAccount, manager);
  }
  return deliverer;
}

async function _sendUnclaimMessages(donation: Donation, receiverAccount: Account, delivererAccount: Account): Promise<void> {
  const accounts: Account[] = [receiverAccount, donation.donorAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = receiverAccount.organization.organizationName;
  let delivererName = '';
  const subjects = [
    `Unclaimed Donation from ${donorName}`,
    `Donation Unclaimed by ${receiverName}`
  ];

  // If donation had a delivery lined up, we must also notify the deliverer.
  if (delivererAccount) {
    accounts.push(delivererAccount);
    delivererName = `${delivererAccount.volunteer.firstName} ${delivererAccount.volunteer.lastName}`;
    subjects.push(`Delivery Cancelled by ${receiverName}`);
  }

  await broadcastEmail(
    MailTransporter.NOREPLY,
    accounts,
    subjects,
    'donation-unclaimed',
    { donation, donorName, receiverName, delivererName, receiverAccount }
  );
}
