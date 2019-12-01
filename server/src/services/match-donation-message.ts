import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { broadcastEmail, MailTransporter } from '../helpers/email';
import { NotificationType, sendNotification } from '../helpers/notification';
import { UpdateDiff } from '../interfaces/update-diff';
import { DonationHelper } from '../shared';

const _donationHelper = new DonationHelper();

/**
 * Sends donation claimed messages to the donor and receiver users that are associated with the claimed donation.
 * @param donation The donation that has been claimed.
 * @return A promise that resolves to the newly claimed donation.
 */
export async function sendClaimMessages(donation: DonationEntity): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const accounts: AccountEntity[] = [donation.claim.receiverAccount, donation.donorAccount];
  const { donorName, receiverName } = _donationHelper.memberNames(donation);
  const subjects = [
    `Claimed Donation from ${donorName}`,
    `Donation Claimed by ${receiverName}`
  ];

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      accounts,
      subjects,
      'donation-claimed',
      { donation, donorName, receiverName }
    ).catch(console.error)
  );

  messagePromises.push(
    sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Donation Claimed`,
        icon: donation.claim.receiverAccount.profileImgUrl,
        body: `
          Donation claimed by <strong>${receiverName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  return donation;
}

/**
 * Sends donation claimed messages to all accounts associated with the unclaimed donation (donor, receiver, & possibly volunteer).
 * @param unclaimDiff The diff of the unclaimed (new) and claimed (old) donation.
 * @return A promise that resolves to the (new) donation that has been unclaimed.
 */
export async function sendUnclaimMessages(unclaimDiff: UpdateDiff<DonationEntity>): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const emailAccounts: AccountEntity[] = [unclaimDiff.old.claim.receiverAccount, unclaimDiff.new.donorAccount];
  const donorName: string = _donationHelper.donorName(unclaimDiff.new);
  const receiverName: string = _donationHelper.receiverName(unclaimDiff.old);
  let delivererName = '';
  const subjects = [
    `Unclaimed Donation from ${donorName}`,
    `Donation Unclaimed by ${receiverName}`
  ];

  // If donation had a delivery lined up, we must also notify the deliverer.
  if (unclaimDiff.old.delivery) {
    emailAccounts.push(unclaimDiff.old.delivery.volunteerAccount);
    delivererName = _donationHelper.delivererName(unclaimDiff.old);
    subjects.push(`Delivery Cancelled by ${receiverName}`);
  }

  await broadcastEmail(
    MailTransporter.NOREPLY,
    emailAccounts,
    subjects,
    'donation-unclaimed',
    {
      donation: unclaimDiff.new,
      donorName,
      receiverName,
      delivererName,
      receiverAccount: unclaimDiff.old.claim.receiverAccount
    }
  ).catch(console.error);

  messagePromises.push(
    sendNotification(
      unclaimDiff.new.donorAccount,
      {
        notificationType: NotificationType.UnclaimDonation,
        notificationLink: `/donation/details/${unclaimDiff.new.id}`,
        title: `Donation Unclaimed`,
        icon: unclaimDiff.old.claim.receiverAccount.profileImgUrl,
        body: `
          Donation unclaimed by <strong>${receiverName}</strong>.<br>
          <i>${unclaimDiff.new.description}</i>
        `
      }
    ).catch(console.error)
  );

  if (unclaimDiff.old.delivery) {
    messagePromises.push(
      sendNotification(
        unclaimDiff.old.delivery.volunteerAccount,
        {
          notificationType: NotificationType.UnclaimDonation,
          notificationLink: `/donation/details/${unclaimDiff.new.id}`,
          title: `Donation Unclaimed`,
          icon: unclaimDiff.old.claim.receiverAccount.profileImgUrl,
          body: `
            Delivery Cancelled by <strong>${receiverName}</strong>.<br>
            <i>${unclaimDiff.new.description}</i>
          `
        }
      ).catch(console.error)
    );
  }

  await Promise.all(messagePromises);
  return unclaimDiff.new;
}
