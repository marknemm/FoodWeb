import { getConnection, EntityManager } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { sendEmail, MailTransporter } from '../helpers/email';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

export async function createDonation(donation: Donation, donorAccount: AccountEntity): Promise<DonationEntity> {
  let createdDonation: DonationEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    donation.donationStatus = 'Unmatched';
    donation.donorAccount = donorAccount;
    createdDonation = await _saveDonation(manager, donation);
    await _sendDonationCreateSuccessEmail(createdDonation, donorAccount);
    // TODO: Quick search for receiver.
    // TODO: Email receiver that a donation will be sent to them. Driver (one of us at first) will call before performing delivery.
  });
  return createdDonation;
}

function _saveDonation(manager: EntityManager, donation: Donation): Promise<DonationEntity> {
  _donationHelper.validateDonation(donation);
  return manager.getRepository(DonationEntity).save(donation);
}

async function _sendDonationCreateSuccessEmail(donation: DonationEntity, account: AccountEntity): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    account.contactInfo.email,
    'Donation Successful',
    'donation-create-success',
    account,
    { donation }
  );
}
