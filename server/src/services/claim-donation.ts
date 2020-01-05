import { EntityManager, getConnection, Repository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationClaimEntity } from '../entity/donation-claim.entity';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { DonationClaim, DonationClaimHelper, DonationClaimRequest, DonationHelper, DonationStatus } from '../shared';
import { genMapRoute } from './gen-map-route';
import { readDonation } from './read-donations';

const _donationHelper = new DonationHelper();
const _donationClaimHelper = new DonationClaimHelper();

/**
 * Claims a donation.
 * @param claimReq The donation claim request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise that resolves to the donation after it has been claimed.
 * @throws FoodWebError if the user is not authorized to claim the donation.
 */
export async function claimDonation(claimReq: DonationClaimRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donationToClaim: DonationEntity = await readDonation(claimReq.donationId);
  _ensureCanClaimDonation(donationToClaim, myAccount);

  const donationClaimUpdate: Partial<DonationEntity> = await _genDonationClaimUpdt(donationToClaim, myAccount);
  _donationClaimHelper.validateDonationClaim(donationClaimUpdate.claim);
  return _saveDonationClaimUpdt(donationClaimUpdate);
}

/**
 * Ensures that the current user can claim a given donation.
 * @param donation The donation that is to be claimed.
 * @param myAccount The account of the user to check for claim authorization.
 * @throws FoodWebError if the user is not authorized to claim the donation.
 */
function _ensureCanClaimDonation(donation: DonationEntity, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationClaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation claim failed: ${errMsg}`);
  }
}

/**
 * Generates a claim donation update based off of a given donation that is to be claimed.
 * @param donationToClaim The donation that is to be claimed.
 * @param receiverAccount The account of the receiver that is claiming the donation.
 * @return The claim donation update.
 */
async function _genDonationClaimUpdt(donationToClaim: DonationEntity, receiverAccount: AccountEntity): Promise<Partial<DonationEntity>> {
  const claimDonationUpdt: Partial<DonationEntity> = { id: donationToClaim.id };
  claimDonationUpdt.donationStatus = DonationStatus.Matched;
  claimDonationUpdt.claim = <DonationClaimEntity> await _genDonationClaim(donationToClaim, receiverAccount);
  return claimDonationUpdt;
}

/**
 * Generates a Donation Claim with a given Donation and receiver Account.
 * @param donation The Donation to generate the claim for.
 * @param receiverAccount The receiver Account that is claiming the donation.
 * @return A promise that resolves to the generated Donation Claim.
 */
async function _genDonationClaim(donation: DonationEntity, receiverAccount: AccountEntity): Promise<DonationClaim> {
  return {
    receiverAccount,
    routeToReceiver: await genMapRoute(donation.donorContactOverride, receiverAccount.contactInfo)
  };
}

async function _saveDonationClaimUpdt(donationClaimUpdate: Partial<DonationEntity>): Promise<DonationEntity> {
  await getConnection().transaction(async (manager: EntityManager) =>
    manager.getRepository(DonationEntity).save(donationClaimUpdate)
  );
  return readDonation(donationClaimUpdate.id);
}
