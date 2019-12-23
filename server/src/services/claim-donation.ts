import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { genDirections } from '../helpers/directions';
import { FoodWebError } from '../helpers/food-web-error';
import { Directions, Donation, DonationClaim, DonationClaimHelper, DonationClaimRequest, DonationHelper, DonationStatus } from '../shared';
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
  let donationToClaim: Donation = await readDonation(claimReq.donationId);
  _ensureCanClaimDonation(donationToClaim, myAccount);

  donationToClaim = await _genClaimedDonation(donationToClaim, myAccount);
  _donationClaimHelper.validateDonationClaim(donationToClaim.claim);

  return getConnection().transaction(async (manager: EntityManager) =>
    manager.getRepository(DonationEntity).save(donationToClaim)
  );
}

/**
 * Ensures that the current user can claim a given donation.
 * @param donation The donation that is to be claimed.
 * @param myAccount The account of the user to check for claim authorization.
 * @throws FoodWebError if the user is not authorized to claim the donation.
 */
function _ensureCanClaimDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationClaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation claim failed: ${errMsg}`);
  }
}

/**
 * Generates a claimed donation based off of a given donation that is to be claimed.
 * @param donationToClaim The donation that is to be claimed.
 * @param receiverAccount The account of the receiver that is claiming the donation.
 * @return The claimed donation.
 */
async function _genClaimedDonation(donationToClaim: Donation, receiverAccount: AccountEntity): Promise<Donation> {
  const claimedDonation: Donation = Object.assign({}, donationToClaim);
  claimedDonation.donationStatus = DonationStatus.Matched;
  claimedDonation.claim = await _genDonationClaim(claimedDonation, receiverAccount);
  return claimedDonation;
}

/**
 * Generates a Donation Claim with a given Donation and receiver Account.
 * @param donation The Donation to generate the claim for.
 * @param receiverAccount The receiver Account that is claiming the donation.
 * @return A promise that resolves to the generated Donation Claim.
 */
async function _genDonationClaim(donation: Donation, receiverAccount: AccountEntity): Promise<DonationClaim> {
  const directions: Directions = await genDirections([
    donation.donorContactOverride,
    receiverAccount.contactInfo
  ]);

  return {
    receiverAccount,
    distanceMiToReceiver: directions.distanceMi,
    durationMinToReceiver: directions.durationMin,
    directionsToReceiver: directions
  };
}
