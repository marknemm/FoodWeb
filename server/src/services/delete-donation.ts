import { getConnection, EntityManager } from 'typeorm';
import { readDonation } from './read-donations';
import { cancelDelivery } from './cancel-delivery';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { DonationHelper, Donation } from '../shared';
import { DonationDeleteRequest } from '../shared';

const _donationHelper = new DonationHelper();

/**
 * Deletes a specified donation.
 * @param deleteReq The donation delete request containing the ID of the donation to delete.
 * @param myAccount The account of the current user issuing the delete request.
 * @return A promise that resolves to the deleted donation.
 * @throws FoodWebError if the current user is not authorized to delete the donation.
 */
export async function deleteDonation(deleteReq: DonationDeleteRequest, myAccount: AccountEntity): Promise<Donation> {
  const donation: DonationEntity = await readDonation(deleteReq.donationId);
  _ensureCanDeleteDonation(donation, myAccount);

  await getConnection().transaction(async (manager: EntityManager) => {
    if (donation.delivery) {
      await cancelDelivery(donation, myAccount, manager);
    }
    await manager.getRepository(DonationEntity).remove(donation);
  });

  return donation;
}

/**
 * Ensures that the current user has privileges to delete a given donation.
 * @param donation The donation that is to be deleted.
 * @param myAccount The account of the user to check for delete privileges.
 * @throws FoodWebError if the user is not authorized to delete the donation.
 */
function _ensureCanDeleteDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delete failed: ${errMsg}`);
  }
}
