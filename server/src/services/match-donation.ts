import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { DistanceTimeQueryResult, getDrivingDistTime } from '../helpers/distance-time';
import { FoodWebError } from '../helpers/food-web-error';
import { UpdateDiff } from '../interfaces/update-diff';
import { Account, Donation, DonationClaim, DonationClaimHelper, DonationClaimRequest, DonationHelper, DonationStatus, DonationUnclaimRequest } from '../shared';
import { cancelDelivery } from './cancel-delivery';
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
  const donationToClaim: Donation = await readDonation(claimReq.donationId);
  _ensureCanClaimDonation(donationToClaim, myAccount);

  let claimedDonation: Donation = Object.assign({}, donationToClaim);
  claimedDonation.donationStatus = DonationStatus.Matched;
  claimedDonation.claim = await _genDonationClaim(claimedDonation, myAccount);

  _donationClaimHelper.validateDonationClaim(claimedDonation.claim);
  return getConnection().transaction(async (manager: EntityManager) =>
    manager.getRepository(DonationEntity).save(claimedDonation)
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
 * Generates a Donation Claim with a given Donation and receiver Account.
 * @param donation The Donation to generate the claim for.
 * @param receiverAccount The receiver Account that is claiming the donation.
 * @return A promise that resolves to the generated Donation Claim.
 */
async function _genDonationClaim(donation: Donation, receiverAccount: Account): Promise<DonationClaim> {
  const drivingDistTime: DistanceTimeQueryResult[] = await getDrivingDistTime([{
    origin: donation.donorContactOverride,
    destination: receiverAccount.contactInfo
  }]);

  return {
    receiverAccount,
    distanceMiToReceiver: drivingDistTime[0].distanceMi,
    durationMinToReceiver: drivingDistTime[0].durationMin
  };
}

/**
 * Unclaims a donation.
 * @param unclaimReq The unclaim donation request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise resolving to the donation after it has been unclaimed.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
export async function unclaimDonation(unclaimReq: DonationUnclaimRequest, myAccount: AccountEntity): Promise<UpdateDiff<Donation>> {
  const donationToUnclaim: Donation = await readDonation(unclaimReq.donationId);
  _ensureCanUnclaimDonation(donationToUnclaim, myAccount);

  let unclaimedDonation: Donation = Object.assign({}, donationToUnclaim);
  await getConnection().transaction(async (manager: EntityManager) => {
    unclaimedDonation = await _cancelDeliveryIfExists(unclaimedDonation, myAccount, manager);
    unclaimedDonation.donationStatus = DonationStatus.Unmatched;
    unclaimedDonation.claim = null;
    unclaimedDonation = await manager.getRepository(DonationEntity).save(unclaimedDonation);
  });

  return { new: unclaimedDonation, old: donationToUnclaim };
}

/**
 * Ensures that the current user has privileges to unclaim a given donation.
 * @param donation The donation that is to be unclaimed.
 * @param myAccount The account of the user to check for unclaim privileges.
 * @throws FoodWebError if the user is not authorized to unclaim the donation.
 */
function _ensureCanUnclaimDonation(donation: Donation, myAccount: Account): void {
  const errMsg: string = _donationHelper.validateDonationUnclaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation unclaim failed: ${errMsg}`);
  }
}

async function _cancelDeliveryIfExists(donation: Donation, myAccount: AccountEntity, manager: EntityManager): Promise<Donation> {
  // If delivery exists, then cancel any associated delivery (without sending cancellation message).
  return (donation.delivery)
    ? await cancelDelivery(donation, myAccount, manager)
    : donation;
}
