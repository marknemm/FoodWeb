import { getConnection, EntityManager } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { readDonation } from './read-donations';
import { sendEmail, MailTransporter } from '../helpers/email';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

export async function deleteDonation(donationId: number, myAccount: AccountEntity): Promise<void> {
  const donation: Donation = await readDonation(donationId);
  _ensureCanDeleteDonation(donation, myAccount);

  await getConnection().transaction(async (manager: EntityManager) => {
    await manager.getRepository(DonationEntity).delete(donationId);
    await _sendDonationDeleteSuccessEmail(donation, myAccount)
  });
}

function _ensureCanDeleteDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delete failed: ${errMsg}`);
  }
}

async function _sendDonationDeleteSuccessEmail(donation: Donation, account: AccountEntity): Promise<void> {
  const sendPromises: Promise<void>[] = [];

  // Send email to donorAccount linked directly to the donation.
  sendPromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.donorAccount.contactInfo.email,
      'Donation Deletion Successful',
      'donation-delete-success',
      donation.donorAccount,
      { donation }
    )
  );

  // Send email to receiverAccount linked directly to the donation.
  if (donation.receiverAccount) {
    sendPromises.push(
      sendEmail(
        MailTransporter.NOREPLY,
        donation.receiverAccount.contactInfo.email,
        `claimed Donation From ${donation.donorAccount.organization.organizationName} Deleted By Donor`,
        'claimed-donation-deleted',
        donation.receiverAccount,
        { donation }
      )
    );
  }

  await Promise.all(sendPromises);
}
