import { AccountEntity, DonationEntity } from '~entity';
import { Account, DonationHelper, DonationStatus, NotificationType, AccountType } from '~shared';
import { broadcastEmail, genDonationEmailSubject, MailTransporter, sendEmail } from '~web/helpers/messaging/email';
import { sendNotification, broadcastNotification } from '~web/helpers/messaging/notification';
import { determineUpdateType, UpdateDiff, UpdateType } from '~web/helpers/misc/update-diff';
import { sendDeliveryCancelledMessages } from '~web/services/delivery/cancel-delivery-message';
import { sendDeliveryAvailableMessages } from '~web/services/delivery/delivery-available-message';
import { sendDeliveryUnavailableMessages } from '~web/services/delivery/delivery-unavailable-message';
import { sendDeliveryScheduledMessages } from '~web/services/delivery/schedule-delivery-message';
import { sendDeliveryStateAdvancedMessages, sendDeliveryStateUndoMessages } from '~web/services/delivery/update-delivery-state-message';
import { sendClaimAvailableMessages } from '~web/services/donation-claim/claim-available-message';
import { sendClaimUnavailableMessages } from '~web/services/donation-claim/claim-unavailable-message';
import { sendClaimedDonationMessages } from '~web/services/donation-claim/claimed-donation-message';
import { sendUnclaimedDonationMessages } from '~web/services/donation-claim/unclaimed-donation-message';
import { sendDonationCreateMessages, sendDonationUpdateMessages } from '~web/services/donation/save-donation-message';

const _donationHelper = new DonationHelper();

/**
 * Sends donation creation messages to all involved parties. Since an admin may create a donation,
 * and advance its state during creation, this acts as an aggregate for all messaging that may occur
 * as a result.
 * @param donation The newly created donation.
 * @return A promise that resolves once all messages have been successfully sent.
 */
export async function adminSendDonationCreateMessages(donation: DonationEntity): Promise<any> {
  const messagePromises: Promise<any>[] = [
    sendDonationCreateMessages(donation)
  ];

  if (!donation.claim) {
    messagePromises.push(
      sendClaimAvailableMessages(donation)
    );
  } else {
    messagePromises.push(
      sendClaimedDonationMessages(donation)
    );

    if (!donation.claim.delivery) {
      messagePromises.push(
        sendDeliveryAvailableMessages(donation)
      );
    } else {
      messagePromises.push(
        sendDeliveryScheduledMessages(donation)
      );

      if (donation.claim.delivery.startTime) {
        messagePromises.push(
          sendDeliveryStateAdvancedMessages(donation)
        );
      }
    }
  }

  return Promise.all(messagePromises);
}

/**
 * Sends donation update messages to all involved parties. Since an admin may update the status
 * and involved parties associated with a donation, it acts as an aggregate of all associated messaging
 * that may occur as a result.
 * @param donationChangeRec The change record for the donation.
 * @return A promise that resolves once all messages have been successfully sent.
 */
export async function adminSendDonationUpdateMessages(donationDiff: UpdateDiff<DonationEntity>): Promise<any> {
  const oldDonation: DonationEntity = donationDiff.old;
  const newDonation: DonationEntity = donationDiff.new;
  const messagePromises: Promise<any>[] = [];

  const receiverUpdtType: UpdateType = determineUpdateType(
    oldDonation.claim?.receiverAccount.id,
    newDonation.claim?.receiverAccount.id
  );
  const volunteerUpdtType: UpdateType = determineUpdateType(
    oldDonation.claim?.delivery?.volunteerAccount.id,
    newDonation.claim?.delivery?.volunteerAccount.id
  );

  if (_wasBaseDonationUpdated(oldDonation, newDonation)) {
    messagePromises.push(
      sendDonationUpdateMessages(donationDiff)
    );
  }

  if (volunteerUpdtType === UpdateType.Delete) {
    messagePromises.push(
      sendDeliveryCancelledMessages(donationDiff)
    );
    if (newDonation.claim) {
      messagePromises.push(
        sendDeliveryAvailableMessages(newDonation)
      );
    }
  }
  if (receiverUpdtType === UpdateType.Delete) {
    messagePromises.push(
      sendUnclaimedDonationMessages(donationDiff),
      sendClaimAvailableMessages(newDonation)
    );
  }

  if (receiverUpdtType === UpdateType.Create) {
    messagePromises.push(
      sendClaimedDonationMessages(newDonation),
      sendClaimUnavailableMessages(newDonation)
    );

    if (!newDonation.claim.delivery) {
      messagePromises.push(
        sendDeliveryAvailableMessages(newDonation)
      );
    }
  }
  if (volunteerUpdtType === UpdateType.Create) {
    messagePromises.push(
      sendDeliveryScheduledMessages(newDonation),
      sendDeliveryUnavailableMessages(newDonation)
    );
  }

  if (receiverUpdtType === UpdateType.Update) {
    messagePromises.push(
      _sendClaimReassignedMessages(donationDiff, volunteerUpdtType)
    );
  }
  if (volunteerUpdtType === UpdateType.Update) {
    messagePromises.push(
      _sendDeliveryReassignedMessages(donationDiff, receiverUpdtType)
    );
  }

  if (_wasDeliveryStatusUpdated(oldDonation, newDonation)) {
    messagePromises.push(
      (_donationHelper.isDonationStatusEarlierThan(oldDonation.donationStatus, newDonation.donationStatus))
        ? sendDeliveryStateAdvancedMessages(newDonation)
        : sendDeliveryStateUndoMessages(donationDiff)
    );
  }

  return Promise.all(messagePromises);
}

/**
 * Checks if a donation's base data was updated during a donation udpate.
 * @param oldDonation The old donation before the update.
 * @param newDonation The new donation after the update.
 * @return true if it was updated, false if not.
 */
function _wasBaseDonationUpdated(oldDonation: DonationEntity, newDonation: DonationEntity): boolean {
  // If donor name changed, make sure it is not due to a complete change of donor account (there's another message for this case).
  const donorNameChanged: boolean = (oldDonation.donorAccount.id === newDonation.donorAccount.id)
    && (oldDonation.donorFirstName !== newDonation.donorFirstName || oldDonation.donorLastName !== newDonation.donorLastName);

  return donorNameChanged
      || oldDonation.estimatedNumFeed !== newDonation.estimatedNumFeed
      || oldDonation.estimatedValue !== newDonation.estimatedValue
      || oldDonation.description !== newDonation.description
      || oldDonation.pickupWindowStart.getTime() !== newDonation.pickupWindowStart.getTime()
      || oldDonation.pickupWindowEnd.getTime() !== newDonation.pickupWindowEnd.getTime()
      || oldDonation.donorContactOverride.id !== newDonation.donorContactOverride.id
      || oldDonation.donorContactOverride.email !== newDonation.donorContactOverride.email
      || oldDonation.donorContactOverride.phoneNumber !== newDonation.donorContactOverride.phoneNumber
      || oldDonation.donorContactOverride.streetAddress !== newDonation.donorContactOverride.streetAddress
      || oldDonation.donorContactOverride.city !== newDonation.donorContactOverride.city
      || oldDonation.donorContactOverride.stateProvince !== newDonation.donorContactOverride.stateProvince
      || oldDonation.donorContactOverride.postalCode !== newDonation.donorContactOverride.postalCode;
}

/**
 * Checks if a donation's delivery status was updated during a donation update.
 * @param oldDonation The old donation before the update.
 * @param newDonation The new donation after the update.
 * @return true if the status was updated, false if not or the donation delivery no longer exists.
 */
function _wasDeliveryStatusUpdated(oldDonation: DonationEntity, newDonation: DonationEntity): boolean {
  return _donationHelper.isDonationStatusLaterThan(oldDonation, DonationStatus.Matched)
      && _donationHelper.isDonationStatusLaterThan(newDonation, DonationStatus.Matched)
      && oldDonation.donationStatus !== newDonation.donationStatus;
}

/**
 * Sends claim reassigned messages to each user associated with a donation (donor, receiver, & old/new volunteer).
 * @param donationDiff The diff of the donation update.
 * @param volunteerUpdtType The type of the update to the donation volunteer. Used to determine if the volunteer has been re-assigned.
 * If the volunteer has been re-assigned, then we do not wish to message the new volunteer about the claim re-assignment.
 * @return A promise that resolves once all messages have been sent.
 */
async function _sendClaimReassignedMessages(donationDiff: UpdateDiff<DonationEntity>, volunteerUpdtType: UpdateType): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const receiverAccount: AccountEntity = donationDiff.new.claim.receiverAccount;
  const oldReceiverAccount: AccountEntity = donationDiff.old.claim.receiverAccount;
  // If the delivery has also been re-assigned, then do not message the new volunteer concerning the claim re-assignment.
  const broadcastAccounts = <AccountEntity[]>_donationHelper.memberAccountsArr(donationDiff.new)
    .filter((account: Account) => (volunteerUpdtType !== UpdateType.Update || account.accountType !== AccountType.Volunteer));
  const donorName: string = _donationHelper.donorName(donationDiff.new);
  const receiverName: string = _donationHelper.receiverName(donationDiff.new);
  const delivererName: string = _donationHelper.delivererName(donationDiff.new);
  const oldReceiverName: string = _donationHelper.receiverName(donationDiff.old);
  const donationEmailSubject: string = genDonationEmailSubject(donationDiff.new);

  // Message all members of the updated donation concerning the claim re-assignment.
  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      broadcastAccounts,
      donationEmailSubject,
      'donation-claim-reassigned',
      { donation: donationDiff.new, donorName, receiverName, delivererName }
    ).catch(console.error)
  );
  messagePromises.push(
    broadcastNotification(
      broadcastAccounts,
      {
        notificationType: NotificationType.ClaimReassigned,
        notificationLink: `donation/details/${donationDiff.new.id}`,
        title: 'Donation Claim Reassigned',
        icon: receiverAccount.profileImgUrl,
        body: `
          Donation claim reassigned to <strong>${receiverName}</strong>.<br>
          <i>${donationDiff.new.description}</i>
        `
      }
    )
  )

  // Simply message old receiver that their claim has been removed.
  messagePromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      oldReceiverAccount,
      donationEmailSubject,
      'donation-unclaimed',
      {
        donation: donationDiff.new,
        donorName,
        receiverName: oldReceiverName,
        receiverAccount: oldReceiverAccount
      }
    ).catch(console.error)
  );
  messagePromises.push(
    sendNotification(
      oldReceiverAccount,
      {
        notificationType: NotificationType.UnclaimDonation,
        notificationLink: `/donation/details/${donationDiff.new.id}`,
        title: `Donation Unclaimed`,
        icon: oldReceiverAccount.profileImgUrl,
        body: `
          Donation claim removed by FoodWeb admin.<br>
          <i>${donationDiff.new.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}

/**
 * Sends delivery reassigned messages to each user associated with a donation (donor, receiver, & old/new volunteer).
 * @param donationDiff The diff of the donation update.
 * @param receiverUpdtType The type of the update to the donation receiver. Used to determine if the receiver has been re-assigned.
 * If the receiver has been re-assigned, then we do not wish to message the new receiver about the delivery re-assignment.
 * @return A promise that resolves once all messages have been sent.
 */
async function _sendDeliveryReassignedMessages(donationDiff: UpdateDiff<DonationEntity>, receiverUpdtType: UpdateType): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const volunteerAccount: AccountEntity = donationDiff.new.claim.delivery.volunteerAccount;
  const oldVolunteerAccount: AccountEntity = donationDiff.old.claim.delivery.volunteerAccount;
  // If the claim has also been re-assigned, then do not message the new receiver concerning the delivery re-assignment.
  const broadcastAccounts = <AccountEntity[]>_donationHelper.memberAccountsArr(donationDiff.new)
    .filter((account: Account) => (receiverUpdtType !== UpdateType.Update || account.accountType !== AccountType.Receiver));
  const donorName: string = _donationHelper.donorName(donationDiff.new);
  const receiverName: string = _donationHelper.receiverName(donationDiff.new);
  const delivererName: string = _donationHelper.delivererName(donationDiff.new);
  const oldDelivererName: string = _donationHelper.delivererName(donationDiff.old);
  const donationEmailSubject: string = genDonationEmailSubject(donationDiff.new);

  // Message all members of the updated donation concerning the delivery re-assignment.
  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      broadcastAccounts,
      donationEmailSubject,
      'delivery-reassigned',
      { donation: donationDiff.new, donorName, receiverName, delivererName, hasVolunteer: !!delivererName }
    ).catch(console.error)
  );
  messagePromises.push(
    broadcastNotification(
      broadcastAccounts,
      {
        notificationType: NotificationType.DeliveryReassigned,
        notificationLink: `donation/details/${donationDiff.new.id}`,
        title: 'Delivery Reassigned',
        icon: volunteerAccount.profileImgUrl,
        body: `
          Donation delivery reassigned to <strong>${delivererName}</strong>.<br>
          <i>${donationDiff.new.description}</i>
        `
      }
    )
  );

  // Simply message old deliverer that their delivery has been cancelled.
  messagePromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      oldVolunteerAccount,
      donationEmailSubject,
      'delivery-cancelled',
      { donation: donationDiff.new, donorName, receiverName, delivererName: oldDelivererName }
    )
  );
  messagePromises.push(
    sendNotification(
      oldVolunteerAccount,
      {
        notificationType: NotificationType.CancelDelivery,
        notificationLink: `donation/details/${donationDiff.new.id}`,
        title: 'Delivery Cancelled',
        icon: oldVolunteerAccount.profileImgUrl,
        body: `
          Donation delivery has been cancelled by a FoodWeb admin.<br>
          <i>${donationDiff.new.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}
