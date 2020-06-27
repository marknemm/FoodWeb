import { DonationEntity } from '~entity';
import { DonationHelper, DonationStatus } from '~shared';
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
    oldDonation.claim?.delivery?.volunteerAccount,
    newDonation.claim?.delivery?.volunteerAccount
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

  }
  if (volunteerUpdtType === UpdateType.Update) {

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

function _wasBaseDonationUpdated(oldDonation: DonationEntity, newDonation: DonationEntity): boolean {
  // If donor name changed, make sure it is not due to a complete change of donor account (there's another message for this case).
  const donorNameChanged: boolean = (oldDonation.donorAccount.id === newDonation.donorAccount.id)
    && (oldDonation.donorFirstName !== newDonation.donorFirstName || oldDonation.donorLastName !== newDonation.donorLastName);

  return donorNameChanged
      || oldDonation.estimatedNumFeed !== newDonation.estimatedNumFeed
      || oldDonation.estimatedValue !== newDonation.estimatedValue
      || oldDonation.description !== newDonation.description
      || oldDonation.pickupWindowStart !== newDonation.pickupWindowStart
      || oldDonation.pickupWindowEnd !== newDonation.pickupWindowEnd
      || oldDonation.donorContactOverride.id !== newDonation.donorContactOverride.id
      || oldDonation.donorContactOverride.email !== newDonation.donorContactOverride.email
      || oldDonation.donorContactOverride.phoneNumber !== newDonation.donorContactOverride.phoneNumber
      || oldDonation.donorContactOverride.streetAddress !== newDonation.donorContactOverride.streetAddress
      || oldDonation.donorContactOverride.city !== newDonation.donorContactOverride.city
      || oldDonation.donorContactOverride.stateProvince !== newDonation.donorContactOverride.stateProvince
      || oldDonation.donorContactOverride.postalCode !== newDonation.donorContactOverride.postalCode;
}

function _wasDeliveryStatusUpdated(oldDonation: DonationEntity, newDonation: DonationEntity): boolean {
  return _donationHelper.isDonationStatusLaterThan(oldDonation, DonationStatus.Matched)
      && _donationHelper.isDonationStatusLaterThan(newDonation, DonationStatus.Matched)
      && oldDonation.donationStatus !== newDonation.donationStatus;
}
