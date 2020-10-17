import { plainToClass } from 'class-transformer';
import { AccountEntity, ContactInfoEntity, DonationEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { AccountHelper, ContactInfo, DonationHelper, DonationSaveData, DonationSaveRequest, DonationStatus } from '~shared';
import { geocode, geoTimezone } from '~web/helpers/map/geocoder';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { FoodWebError } from '~web/helpers/response/foodweb-error';
import { readDonation } from '~web/services/donation/read-donations';
import { genMapRoute } from '~web/services/map/read-map-routes';

const _donationHelper = new DonationHelper();
const _accountHelper = new AccountHelper();

export async function createDonation(createReq: DonationSaveRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donationToSave: DonationSaveData = await prepareDonation(createReq.donationSaveData, myAccount);
  return OrmEntityManager.transaction((manager: OrmEntityManager) =>
    manager.getRepository(DonationEntity).save(donationToSave)
  );
}

export async function updateDonation(updateReq: DonationSaveRequest, myAccount: AccountEntity): Promise<UpdateDiff<DonationEntity>> {
  const originalDonation: DonationEntity = await readDonation(updateReq.donationSaveData.id);
  const donationToSave: DonationSaveData = await prepareDonation(updateReq.donationSaveData, myAccount, originalDonation);
  _removeNonUpdateFields(<DonationEntity>donationToSave);
  const updatedDonation: DonationEntity = await _saveDonationUpdate(donationToSave, originalDonation);
  return { old: originalDonation, new: updatedDonation };
}

export async function prepareDonation(
  donationSaveData: DonationSaveData,
  myAccount: AccountEntity,
  origDonation?: DonationEntity
): Promise<DonationSaveData> {
  const donationToSave: DonationSaveData = plainToClass(DonationEntity, donationSaveData);

  // Perform tasks and validation for both donation create & update.
  donationToSave.donorAccount = (donationToSave.donorAccount ? donationToSave.donorAccount : myAccount);
  donationToSave.donationStatus = (donationToSave.donationStatus ? donationToSave.donationStatus : DonationStatus.Unmatched);
  _validateDonation(donationToSave);
  await _preprocessDonorContactOverride(donationToSave);

  // Perform tasks specific to donation update if this is an update.
  if (donationToSave.id != null) {
    origDonation = origDonation ? origDonation : await readDonation(donationToSave.id);
    _ensureCanUpdateDonation(donationToSave, myAccount);
    await _recalcRoutesIfAddressChange(donationToSave, origDonation.donorContactOverride);
  }

  return donationToSave;
}

function _validateDonation(donation: DonationSaveData): void {
  const errMsg: string = _donationHelper.validateDonation(donation);
  if (errMsg) {
    throw new FoodWebError(errMsg);
  }
}

function _ensureCanUpdateDonation(donation: DonationSaveData, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Update failed: ${errMsg}`);
  }
}

async function _preprocessDonorContactOverride(donation: DonationSaveData): Promise<void> {
  const donorContactOverride: ContactInfo = donation.donorContactOverride;
  if (_accountHelper.areContactInfosEqual(donorContactOverride, donation.donorAccount.contactInfo)) {
    donation.donorContactOverride = null;
  } else {
    // If the donor contact override was the same as the donor's regular contact info, but it was updated,
    // then unset ID to create new ContactInfo for the override.
    if (donorContactOverride.id === donation.donorAccount.contactInfo.id) {
      donorContactOverride.id = undefined;
    }
    donorContactOverride.location = await geocode(donorContactOverride);
    donorContactOverride.timezone = geoTimezone(donorContactOverride.location);
    donorContactOverride.phoneNumber = _accountHelper.formatPhoneNumber(donorContactOverride.phoneNumber);
  }
}

async function _recalcRoutesIfAddressChange(updtDonation: DonationSaveData, origDonorContactInfo: ContactInfoEntity): Promise<void> {
  /* NOTE: The donorContactOverride can be null just before saving,
   * since if it is the same as the donor's contact info, we don't want to actually save a copy. */
  const updtDonorContactInfo: ContactInfo = (updtDonation.donorContactOverride)
    ? updtDonation.donorContactOverride
    : updtDonation.donorAccount.contactInfo;

  const donorOverrideAddressSame: boolean = _accountHelper.areAddressesEqual(updtDonorContactInfo, origDonorContactInfo);
  if (!donorOverrideAddressSame && updtDonation.claim) {
    updtDonation.claim.routeToReceiver = await genMapRoute(updtDonorContactInfo, updtDonation.claim.receiverAccount.contactInfo);

    if (updtDonation.claim.delivery) {
      const { volunteerAccount } = _donationHelper.memberAccounts(updtDonation);
      updtDonation.claim.delivery.routeToDonor = await genMapRoute(volunteerAccount.contactInfo, updtDonorContactInfo);
    }
  }
}

function _removeNonUpdateFields(donation: DonationEntity): void {
  // Remove fields that shouldn't be updated by the current update operation for extra security.
  delete donation.createTimestamp;
  delete donation.updateTimestamp;
  delete donation.donorAccount;
  delete donation.donationStatus;
  delete donation.claim;
}

async function _saveDonationUpdate(donation: DonationSaveData, originalDonation: DonationEntity): Promise<DonationEntity> {
  return OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    const updateResult: DonationEntity = await manager.getRepository(DonationEntity).save(donation, { mergeInto: originalDonation });

    // If we got rid of the donor contact info override on the donation, we must cleanup dangling entry.
    if (!donation.donorContactOverride && _donationHelper.hasDonorContactInfoOverride(originalDonation)) {
      await manager.getRepository(ContactInfoEntity).remove(originalDonation.donorContactOverride);
    }

    return updateResult;
  });
}
