import { AccountEntity, DonationEntity } from '~entity';
import { DateTimeHelper, DonationHelper, DonationStatus } from '~shared';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '~web/helpers/messaging/email';
import { broadcastNotification, NotificationType } from '~web/helpers/messaging/notification';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { sendDeliveryCancelledMessages } from './cancel-delivery-message';

const _dateTimeHelper = new DateTimeHelper();
const _donationHelper = new DonationHelper();

/**
 * Sends delivery state advanced messages to each user associated with the given donation (donor, receiver, & volunteer).
 * @param donation The donation that has had its delivery state advanced.
 * @return A promise that resolves to the given donation.
 */
export async function sendDeliveryStateAdvancedMessages(donation: DonationEntity): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const volunteerAccount: AccountEntity = donation.claim.delivery.volunteerAccount;
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount, volunteerAccount];
  const notificationAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const advanceAction: string = _getDeliveryAdvanceAction(donation);
  const emailTmpl: string = _getDeliveryAdvanceEmailTmpl(donation);

  const donorTimezone: string = donation.donorContactOverride.timezone;
  const receiverTimezone: string = donation.claim.receiverAccount.contactInfo.timezone;
  const pickupWindowStartTime: string = _dateTimeHelper.toLocalTimeStr(donation.claim.delivery.pickupWindowStart, donorTimezone);
  const pickupWindowEndTime: string = _dateTimeHelper.toLocalTimeStr(donation.claim.delivery.pickupWindowEnd, donorTimezone);
  const dropOffWindowStartTime: string = _dateTimeHelper.toLocalTimeStr(donation.claim.delivery.dropOffWindowStart, receiverTimezone);
  const dropOffWindowEndTime: string = _dateTimeHelper.toLocalTimeStr(donation.claim.delivery.dropOffWindowEnd, receiverTimezone);

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      genDonationEmailSubject(donation),
      emailTmpl,
      {
        donation,
        donorName,
        receiverName,
        delivererName,
        pickupWindowStartTime,
        pickupWindowEndTime,
        dropOffWindowStartTime,
        dropOffWindowEndTime
      }
    ).catch(console.error)
  );

  messagePromises.push(
    broadcastNotification(
      notificationAccounts,
      {
        notificationType: NotificationType.DeliveryStateAdvance,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Delivery ${advanceAction}`,
        icon: volunteerAccount.profileImg,
        body: `
          Delivery Has Been <strong>${advanceAction}</strong> by <strong>${delivererName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    )
  );

  await Promise.all(messagePromises);
  return donation;
}

/**
 * Gets the delivery advance action from a given donation's donationStatus property.
 * @param donation The donation to derive the delivery advance action from.
 * @return The delivery advance action.
 */
function _getDeliveryAdvanceAction(donation: DonationEntity): string {
  switch (donation.donationStatus) {
    case DonationStatus.Started:  return 'Started';
    case DonationStatus.PickedUp: return 'Picked Up';
    case DonationStatus.Complete: return 'Completed';
  }
  throw new Error(`Donation Status is not Correct for a delivery advance action: ${donation.donationStatus}`);
}

/**
 * Gets the delivery advance email template based off of a given donation's donationStatus.
 * @param donation The donation from which to derive the delivery advance email template.
 * @return The delivery advance email template (name).
 */
function _getDeliveryAdvanceEmailTmpl(donation: DonationEntity): string {
  switch (donation.donationStatus) {
    case DonationStatus.Started:  return 'delivery-started';
    case DonationStatus.PickedUp: return 'delivery-picked-up';
    case DonationStatus.Complete: return 'delivery-complete';
  }
  throw new Error(`Donation Status is not Correct for a delivery advance email template: ${donation.donationStatus}`);
}

/**
 * Sends delivery state undo messages to each user associated with the given donation (donor, receiver, & volunteer).
 * If the delivery state is changed from scheduled to unscheduled, then delivery cancellation messages are sent.
 * @param undoDiff The donation delivery state undo diff.
 * @return A promise that resolves to the updated (new) donation with its delivery state undone.
 */
export async function sendDeliveryStateUndoMessages(undoDiff: UpdateDiff<DonationEntity>): Promise<DonationEntity> {
  return (undoDiff.new.donationStatus === DonationStatus.Matched)
    ? sendDeliveryCancelledMessages(undoDiff)
    : _sendDeliveryStateUndoMessages(undoDiff.new);
}

/**
 * Sends delivery state undo messages to each user associated with the given donation (donor, receiver, & volunteer).
 * @param donation The donation that has had its delivery state undone.
 * @return A promise that resolves to the given donation.
 */
async function _sendDeliveryStateUndoMessages(donation: DonationEntity): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const volunteerAccount: AccountEntity = donation.claim.delivery.volunteerAccount;
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount, volunteerAccount];
  const notificationAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      genDonationEmailSubject(donation),
      'delivery-status-undo',
      { donation, donorName, receiverName, delivererName }
    ).catch(console.error)
  );

  messagePromises.push(
    broadcastNotification(
      notificationAccounts,
      {
        notificationType: NotificationType.DeliveryStateUndo,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Delivery Reverted to ${donation.donationStatus}`,
        icon: volunteerAccount.profileImg,
        body: `
          Delivery Status has been reverted to ${donation.donationStatus} by ${delivererName}.<br>
          <i>${donation.description}</i>
        `
      }
    )
  );

  return donation;
}
