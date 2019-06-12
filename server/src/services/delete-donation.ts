import { getConnection, EntityManager } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity, Account } from '../entity/account.entity';
import { DeliveryEntity } from '../entity/delivery-entity';
import { FoodWebError } from '../helpers/food-web-error';
import { readDonation } from './read-donations';
import { MailTransporter, broadcastEmail } from '../helpers/email';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

export async function deleteDonation(donationId: number, myAccount: AccountEntity): Promise<void> {
  const donation = <DonationEntity> await readDonation(donationId);
  _ensureCanDeleteDonation(donation, myAccount);

  await getConnection().transaction(async (manager: EntityManager) => {
    if (donation.delivery) {
      await manager.getRepository(DeliveryEntity).remove(donation.delivery);
    }
    await manager.getRepository(DonationEntity).remove(donation);
  });

  await _sendDonationDeleteSuccessEmail(donation);
}

function _ensureCanDeleteDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delete failed: ${errMsg}`);
  }
}

async function _sendDonationDeleteSuccessEmail(donation: Donation): Promise<void> {
  const accounts: Account[] = [donation.donorAccount];
  const donorName: string = _donationHelper.donorName(donation);
  let receiverName = '';
  let delivererName = '';
  const subjects = ['Successfully Deleted Donation'];

  // If donation was claimed by a receiver, then we must also notify them.
  if (donation.receiverAccount) {
    accounts.push(donation.receiverAccount);
    receiverName = _donationHelper.receiverName(donation);
    subjects.push(`Claimed Donation Deleted by ${donorName}`);
  }

  // If donation had a delivery lined up, we must also notify the deliverer.
  if (donation.delivery) {
    accounts.push(donation.delivery.volunteerAccount);
    delivererName = _donationHelper.delivererName(donation);
    subjects.push(`Delivery Cancelled by ${donorName}`);
  }

  await broadcastEmail(
    MailTransporter.NOREPLY,
    accounts,
    subjects,
    'donation-deleted',
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);
}
