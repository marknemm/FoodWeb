import { getConnection, EntityManager, Repository } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { readDonation } from './read-donations';
import { sendEmail, MailTransporter } from '../helpers/email';
import { FoodWebError } from '../helpers/food-web-error';
import { Account } from '../../../shared/src/interfaces/account/account';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

export async function createDonation(donation: Donation, myAccount: AccountEntity): Promise<DonationEntity> {
  donation.donationStatus = 'Unmatched';
  donation.donorAccount = myAccount;
  _validateDonation(donation);

  const createdDonation: DonationEntity = await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(donation)
  );
  await _sendDonationCreateSuccessEmail(createdDonation, myAccount);

  return createdDonation;
}

export async function updateDonation(donation: Donation, myAccount: AccountEntity): Promise<Donation> {
  _validateDonation(donation);
  _ensureCanUpdateDonation(donation, myAccount);

  _removeNonUpdateFields(donation);
  const originalDonation: Donation = await readDonation(donation.id);

  const updatedDonation: Donation = await getConnection().transaction(async (manager: EntityManager) => {
    const donationRepo: Repository<DonationEntity> = manager.getRepository(DonationEntity);
    await donationRepo.save(donation);
    // Must do separate query b/c save method will only return updated properties in entity (partial entity).
    return readDonation(donation.id, donationRepo);
  });
  _sendDonationUpdateSuccessEmails(originalDonation, updatedDonation)

  return updatedDonation;
}

function _validateDonation(donation: Donation): void {
  const errMsg: string = _donationHelper.validateDonation(donation);
  if (errMsg) {
    throw new FoodWebError(errMsg);
  }
}

function _ensureCanUpdateDonation(donation: Donation, myAccount: Account): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Update failed: ${errMsg}`);
  }
}

function _removeNonUpdateFields(donation: Donation): void {
  // Remove fields that shouldn't be updated by the current update operation for extra security.
  delete donation.lastUpdated;
  delete donation.donorAccount;
  delete donation.donationStatus;
  delete donation.receiverAccount;
}

function _sendDonationCreateSuccessEmail(donation: Donation, account: AccountEntity): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Donation Successful',
    'donation-create-success',
    { donation }
  ).catch(console.error);
}

function _sendDonationUpdateSuccessEmails(originalDonation: Donation, updatedDonation: Donation): Promise<void> {
  // Send e-mail to donorAccount linked directly to the donation.
  return sendEmail(
    MailTransporter.NOREPLY,
    updatedDonation.donorAccount,
    'Donation Update Successful',
    'donation-update-success',
    { originalDonation, updatedDonation }
  ).catch(console.error);
}
