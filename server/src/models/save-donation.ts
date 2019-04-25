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
  let createdDonation: DonationEntity;
  donation.donationStatus = 'Unmatched';
  donation.donorAccount = myAccount;
  _validateDonation(donation);

  await getConnection().transaction(async (manager: EntityManager) => {
    createdDonation = await manager.getRepository(DonationEntity).save(donation);
    await _sendDonationCreateSuccessEmail(createdDonation, myAccount);
  });
  return createdDonation;
}

export async function updateDonation(donation: Donation, myAccount: AccountEntity): Promise<Donation> {
  let updatedDonation: Donation;
  _validateDonation(donation);
  _ensureCanUpdateDonation(donation, myAccount);

  _removeNonUpdateFields(donation);
  const originalDonation: Donation = await readDonation(donation.id, myAccount);

  await getConnection().transaction(async (manager: EntityManager) => {
    const donationRepo: Repository<DonationEntity> = manager.getRepository(DonationEntity);
    await donationRepo.save(donation);
    // Must do separate query b/c save method will only return updated properties in entity (partial entity).
    updatedDonation = await readDonation(donation.id, myAccount, donationRepo);
    _sendDonationUpdateSuccessEmails(originalDonation, updatedDonation, myAccount)
  });
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

async function _sendDonationCreateSuccessEmail(donation: Donation, account: AccountEntity): Promise<void> {
  await sendEmail(
    MailTransporter.NOREPLY,
    account.contactInfo.email,
    'Donation Successful',
    'donation-create-success',
    account,
    { donation }
  );
}

async function _sendDonationUpdateSuccessEmails(originalDonation: Donation, updatedDonation: Donation, account: AccountEntity): Promise<void> {
  // If an 'Admin' account edited another user's donation, then also send e-mail to admin.
  if (account.id !== updatedDonation.donorAccount.id) {
    await sendEmail(
      MailTransporter.NOREPLY,
      account.contactInfo.email,
      '(Admin) Donation Update Successful',
      'donation-update-success',
      account,
      { originalDonation, updatedDonation }
    );
  }

  // Send e-mail to donorAccount linked directly to the donation.
  await sendEmail(
    MailTransporter.NOREPLY,
    updatedDonation.donorAccount.contactInfo.email,
    'Donation Update Successful',
    'donation-update-success',
    updatedDonation.donorAccount,
    { originalDonation, updatedDonation }
  );
}
