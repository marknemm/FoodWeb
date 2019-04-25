import { getConnection, EntityManager } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { readAccounts, AccountsQueryResult } from './read-accounts';
import { sendEmail, MailTransporter } from '../helpers/email';
import { FoodWebError } from '../helpers/food-web-error';
import { readDonation } from './read-donations';
import { DonationEntity } from '../entity/donation.entity';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { Account } from '../../../shared/src/interfaces/account/account';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';

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
    receiver.contactInfo.email,
    `Donation Available From ${donation.donorAccount.organization.organizationName}`,
    'donation-match-request',
    receiver,
    { donation }
  );
}

export async function claimDonation(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donationToClaim: Donation = await readDonation(donationId, myAccount);
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
  const sendPromises: Promise<void>[] = [];

  // Send receiver message.
  sendPromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.receiverAccount.contactInfo.email,
      `Claimed Donation From ${donation.donorAccount.organization.organizationName}`,
      'donation-claim-success',
      donation.receiverAccount,
      { donation }
    )
  );

  // Send donor message.
  sendPromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.donorAccount.contactInfo.email,
      `Donation Claimed By ${donation.receiverAccount.organization.organizationName}`,
      'donation-claimed-by',
      donation.donorAccount,
      { donation }
    )
  );

  await Promise.all(sendPromises);
}

export async function unclaimDonation(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donationToUnclaim: Donation = await readDonation(donationId, myAccount);
  const receiver: Account = donationToUnclaim.receiverAccount;
  _ensureCanUnclaimDonation(donationToUnclaim, myAccount);
  donationToUnclaim.donationStatus = 'Unmatched';
  donationToUnclaim.receiverAccount = null;

  let claimedDonation: Donation;
  await getConnection().transaction(async (manager: EntityManager) => {
    claimedDonation = await manager.getRepository(DonationEntity).save(donationToUnclaim);
    await _sendUnclaimMessages(claimedDonation, receiver);
  });
  return claimedDonation;
}

function _ensureCanUnclaimDonation(donation: Donation, myAccount: Account): void {
  const errMsg: string = _donationHelper.validateDonationUnclaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation unclaim failed: ${errMsg}`);
  }
}

async function _sendUnclaimMessages(donation: Donation, receiver: Account): Promise<void> {
  const sendPromises: Promise<void>[] = [];

  sendPromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      receiver.contactInfo.email,
      `Unclaimed Donation From ${donation.donorAccount.organization.organizationName}`,
      'donation-unclaim-success',
      receiver,
      { donation }
    )
  );

  sendPromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.donorAccount.contactInfo.email,
      `Donation Unclaimed By ${receiver.organization.organizationName}`,
      'donation-unclaimed-by',
      donation.donorAccount,
      { donation, receiver }
    )
  );

  await Promise.all(sendPromises);
}
