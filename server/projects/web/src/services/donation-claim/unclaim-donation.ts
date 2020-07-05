import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity, DonationClaimEntity, DonationEntity } from '~entity';
import { DonationHelper, DonationStatus, DonationUnclaimRequest } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { readDonation } from '../donation/read-donations';

const _donationHelper = new DonationHelper();

/**
 * Unclaims a donation.
 * @param unclaimReq The unclaim donation request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise resolving to the donation after it has been unclaimed.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
export async function unclaimDonation(
  unclaimSrc: DonationUnclaimRequest,
  myAccount: AccountEntity,
): Promise<UpdateDiff<DonationEntity>> {
  const donation: DonationEntity = await _getDonationToUnclaim(unclaimSrc);

  await getConnection().transaction(
    async (localManager: EntityManager) => await _deleteClaim(donation, myAccount, localManager)
  );

  return {
    new: await readDonation(donation.id),
    old: donation
  };
}

/**
 * Gets the donation that is to be unclaimed from a given raw donation unclaimSrc.
 * @param unclaimSrc The unclaim donation request or the donation that is to be unclaimed.
 * @return A promise that resolves to the donation that is to be unclaimed.
 */
async function _getDonationToUnclaim(unclaimSrc: DonationUnclaimRequest | DonationEntity): Promise<DonationEntity> {
  return (unclaimSrc instanceof DonationEntity)
    ? unclaimSrc
    : await readDonation(unclaimSrc.donationId);
}

/**
 * Deletes the DonationClaim entry associated with a given donation.
 * @param donation The donation that is to be unclaimed.
 * @param myAccount The account of the user that is unclaiming the donation.
 * @param manager The database manager used for the operation.
 * @return A promise that resolves once the operation is completed.
 */
async function _deleteClaim(donation: DonationEntity, myAccount: AccountEntity, manager: EntityManager): Promise<void> {
  _ensureCanUnclaimDonation(donation, myAccount);
  await manager.getRepository(DonationEntity).update(donation.id, { donationStatus: DonationStatus.Unmatched });
  await manager.getRepository(DonationClaimEntity).remove(donation.claim);
}

/**
 * Ensures that the current user has privileges to unclaim a given donation.
 * @param donation The donation that is to be unclaimed.
 * @param myAccount The account of the user to check for unclaim privileges.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
function _ensureCanUnclaimDonation(donation: DonationEntity, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationUnclaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation unclaim failed: ${errMsg}`);
  }
}
