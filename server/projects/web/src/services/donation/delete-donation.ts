import { AccountEntity, ContactInfoEntity, DonationEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { DonationDeleteRequest, DonationHelper } from '~shared';
import { FoodWebError } from '~web/helpers/response/foodweb-error';
import { sendDeliveryUnavailableMessages } from '../delivery/delivery-unavailable-message';
import { sendClaimUnavailableMessages } from '../donation-claim/claim-unavailable-message';
import { readDonation } from './read-donations';

const _donationHelper = new DonationHelper();

/**
 * Deletes a specified donation.
 * @param deleteReq The donation delete request containing the ID of the donation to delete.
 * @param myAccount The account of the current user issuing the delete request.
 * @return A promise that resolves to the deleted donation.
 * @throws FoodWebError if the current user is not authorized to delete the donation.
 */
export async function deleteDonation(deleteReq: DonationDeleteRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donation: DonationEntity = await readDonation(deleteReq.donationId);
  _ensureCanDeleteDonation(donation, myAccount);

  await OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    // NOTE: Must do this before deleting so that notify records in database don't have broken foreign reference to donation.
    await _notifyDonationNoLongerAvailable(donation, manager);
    await manager.getRepository(DonationEntity).remove(donation);
    await _removeRelatedEntities(donation, manager);
  });

  return donation;
}

/**
 * Ensures that the current user has privileges to delete a given donation.
 * @param donation The donation that is to be deleted.
 * @param myAccount The account of the user to check for delete privileges.
 * @throws FoodWebError if the user is not authorized to delete the donation.
 */
function _ensureCanDeleteDonation(donation: DonationEntity, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delete failed: ${errMsg}`);
  }
}

/**
 * Notifies either receivers or volunteers that a donation claim or delivery will no longer be available.
 * @param donation The donation that will no longer be available.
 * @param manager The Entity Manager for the current database transaction.
 * @return A promise that resolves once the operaiton completes.
 */
async function _notifyDonationNoLongerAvailable(donation: DonationEntity, manager: OrmEntityManager): Promise<void> {
  if (!donation.claim) {
    // Notify receivers that were offered the claim that it is no longer available.
    await sendClaimUnavailableMessages(donation, manager);
  } else if (!donation.claim.delivery) {
    // Notify volunteers that were offered the delivery that it is no longer available.
    await sendDeliveryUnavailableMessages(donation, manager);
  }
}

/**
 * Removes all related entities that reference the donation that is being deleted.
 * @param donation The donation that is being deleted.
 * @param manager The entity manager used to perform queries under a transaction.
 * @return A promise that resolves once the operation is finished.
 */
async function _removeRelatedEntities(donation: DonationEntity, manager: OrmEntityManager): Promise<void> {
  // Remove donor contact info override if it exists and is not equivalent to the donor's normal contact info.
  if (donation.donorContactOverride && donation.donorContactOverride.id !== donation.donorAccount.contactInfo.id) {
    await manager.getRepository(ContactInfoEntity).remove(donation.donorContactOverride);
  }
}
