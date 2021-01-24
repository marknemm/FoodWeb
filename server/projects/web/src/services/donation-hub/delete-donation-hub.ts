import { AccountEntity, ContactInfoEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { validateDonationHubModPrivilege } from './validate-donation-hub';
import { readDonationHub } from './read-donation-hubs';

/**
 * Deletes a specified donation hub.
 * @param donationHubId The ID of the donation hub that should be deleted.
 * @param myAccount The account of the current user issuing the delete request.
 * @return A promise that resolves to the deleted donation hub.
 * @throws FoodWebError if the current user is not authorized to delete the donation.
 */
export async function deleteDonationHub(donationHubId: number, myAccount: AccountEntity): Promise<DonationHubEntity> {
  const donationHub: DonationHubEntity = await readDonationHub(donationHubId);
  validateDonationHubModPrivilege(donationHub.volunteerAccount.id, myAccount);

  await OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    await manager.getRepository(DonationHubEntity).remove(donationHub);
    await _removeContactOverride(donationHub, manager);
  });

  return donationHub;
}

/**
 * Removes any contact info override that may have been associated with the removed donation hub.
 * @param donationHub The donation hub that has been deleted.
 * @param manager The entity manager used to perform queries under a transaction.
 * @return A promise that resolves once the operation is finished.
 */
async function _removeContactOverride(donationHub: DonationHubEntity, manager: OrmEntityManager): Promise<void> {
  // Remove donor contact info override if it exists and is not equivalent to the donor's normal contact info.
  if (donationHub.contactOverride && donationHub.contactOverride.id !== donationHub.volunteerAccount.contactInfo.id) {
    await manager.getRepository(ContactInfoEntity).remove(donationHub.contactOverride);
  }
}
