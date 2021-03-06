import { AccountEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { readDonationHubPledge } from './read-donation-hub-pledges';
import { validateDonationHubPledgeModPrivilege } from './validate-donation-hub-pledge';

/**
 * Deletes a specified donation hub.
 * @param donationHubId The ID of the donation hub that should be deleted.
 * @param myAccount The account of the current user issuing the delete request.
 * @return A promise that resolves to the deleted donation hub.
 * @throws FoodWebError if the current user is not authorized to delete the donation.
 */
export async function deleteDonationHubPledge(donationHubPledgeId: number, myAccount: AccountEntity): Promise<DonationHubPledgeEntity> {
  const pledge: DonationHubPledgeEntity = await readDonationHubPledge(donationHubPledgeId);
  validateDonationHubPledgeModPrivilege(pledge.account.id, myAccount);

  await OrmEntityManager.transaction(async (manager: OrmEntityManager) =>
    manager.getRepository(DonationHubPledgeEntity).remove(pledge)
  );

  return pledge;
}
