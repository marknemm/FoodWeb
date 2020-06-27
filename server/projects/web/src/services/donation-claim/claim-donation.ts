import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity, DonationClaimEntity, DonationEntity } from '~entity';
import { DateTimeHelper, DonationClaimHelper, DonationClaimRequest, DonationHelper, DonationStatus, Donation, ContactInfo } from '~shared';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { ClaimedDonationSaveData, DonationClaimSaveData } from '~web/interfaces/donation-claim/donation-claim-save-data';
import { readDonation } from '~web/services/donation/read-donations';
import { genMapRoute } from '~web/services/map/read-map-routes';
import { plainToClass } from 'class-transformer';

const _donationHelper = new DonationHelper();
const _donationClaimHelper = new DonationClaimHelper();
const _dateTimeHelper = new DateTimeHelper();

/**
 * Claims a donation.
 * @param claimReq The donation claim request.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise that resolves to the donation after it has been claimed.
 * @throws FoodWebError if the user is not authorized to claim the donation.
 */
export async function claimDonation(claimReq: DonationClaimRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donationToClaim: DonationEntity = await readDonation(claimReq.donationId);
  const donationClaim: DonationClaimSaveData = await prepareDonationClaim(donationToClaim, myAccount);
  const claimedDonation: ClaimedDonationSaveData = await _genClaimedDonation(donationToClaim, donationClaim);
  return _saveDonationClaimUpdt(claimedDonation);
}

/**
 * Prepares a donation claim for a given donation being claimed by a given account.
 * Also, performs all necesssary validation on the input data.
 * @param donationToClaim The donation that is to be claimed.
 * @param myAccount The account of the current user submitting the request.
 * @return A promise that resolves to the prepared donation claim.
 * @throws FoodWebError if the user is not authorized to claim the donation.
 */
export async function prepareDonationClaim(donationToClaim: Partial<Donation>, myAccount: AccountEntity): Promise<DonationClaimSaveData> {
  _ensureCanClaimDonation(donationToClaim, myAccount);
  const donationClaim: DonationClaimSaveData = await _genDonationClaim(donationToClaim, myAccount);
  _validateDonationClaim(donationClaim);
  return donationClaim;
}

/**
 * Ensures that the current user can claim a given donation.
 * @param donation The donation that is to be claimed.
 * @param myAccount The account of the user to check for claim authorization.
 * @throws FoodWebError if the user is not authorized to claim the donation.
 */
function _ensureCanClaimDonation(donation: Partial<Donation>, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationClaimPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Donation claim failed: ${errMsg}`);
  }
}

/**
 * Validates given donation claim save data.
 * @param donationClaim The donation claim save data that is to be validated.
 * @throws FoodWebError if the given donation claim save data is invalid.
 */
function _validateDonationClaim(donationClaim: DonationClaimSaveData): void {
  const validationErrMsg: string = _donationClaimHelper.validateDonationClaim(donationClaim);
  if (validationErrMsg) {
    throw new FoodWebError(validationErrMsg);
  }
}

/**
 * Generates donation claim save data with a given donation and receiver Account.
 * @param donation The donation to generate the claim for.
 * @param receiverAccount The receiver Account that is claiming the donation.
 * @return A promise that resolves to the generated Donation Claim save data.
 */
async function _genDonationClaim(donation: Partial<Donation>, receiverAccount: AccountEntity): Promise<DonationClaimSaveData> {
  const donationClaim = new DonationClaimEntity();
  const donorContactInfo: ContactInfo = donation.donorContactOverride ? donation.donorContactOverride : donation.donorAccount.contactInfo;
  donationClaim.receiverAccount = receiverAccount;
  donationClaim.routeToReceiver = await genMapRoute(donorContactInfo, receiverAccount.contactInfo);
  donationClaim.dropOffWindowStart = _dateTimeHelper.addMinutes(donation.pickupWindowStart, donationClaim.routeToReceiver.durationMin);
  donationClaim.dropOffWindowEnd = _dateTimeHelper.addMinutes(donation.pickupWindowEnd, donationClaim.routeToReceiver.durationMin);
  return donationClaim;
}

/**
 * Generates claimed donation save data based off of a given donation that is to be claimed and donation claim save data.
 * @param donationToClaim The donation that is to be claimed.
 * @param donationClaim The donation claim save data.
 * @return The claimed donation save data.
 */
async function _genClaimedDonation(
  donationToClaim: DonationEntity,
  donationClaim: DonationClaimSaveData
): Promise<ClaimedDonationSaveData> {
  const claimDonationUpdt: ClaimedDonationSaveData = {
    id: donationToClaim.id,
    donationStatus: DonationStatus.Matched,
    claim: donationClaim
  };
  claimDonationUpdt.donationStatus = DonationStatus.Matched;
  claimDonationUpdt.claim = donationClaim;
  return claimDonationUpdt;
}

/**
 * Persists given claimed donation save data to the database.
 * @param claimedDonation The claimed donation save data.
 * @return A promise that resolves to the full donation entity of the newly claimed donation.
 */
async function _saveDonationClaimUpdt(claimedDonation: ClaimedDonationSaveData): Promise<DonationEntity> {
  await getConnection().transaction(async (manager: EntityManager) =>
    manager.getRepository(DonationEntity).save(plainToClass(DonationClaimEntity, claimedDonation))
  );
  return readDonation(claimedDonation.id);
}
