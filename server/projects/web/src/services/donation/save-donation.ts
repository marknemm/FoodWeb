import { plainToClass } from 'class-transformer';
import { AccountEntity } from 'database/src/entity/account.entity';
import { ContactInfoEntity } from 'database/src/entity/contact-info.entity';
import { DonationEntity } from 'database/src/entity/donation.entity';
import { OrmEntityManager } from '~orm/index';
import { geocode, geoTimezone } from '~web/helpers/map/geocoder';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { AccountHelper, ContactInfo, Donation, DonationCreateRequest, DonationHelper, DonationStatus, DonationUpdateRequest } from '~shared';
import { genMapRoute } from '../map/read-map-routes';
import { readDonation } from './read-donations';

const _donationHelper = new DonationHelper();
const _accountHelper = new AccountHelper();

export async function createDonation(createReq: DonationCreateRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donationToSave: Donation = createReq.donation;
  donationToSave.donationStatus = DonationStatus.Unmatched;
  donationToSave.donorAccount = myAccount;
  _validateDonation(donationToSave);
  await _preprocessDonorContactOverride(donationToSave);

  return OrmEntityManager.transaction((manager: OrmEntityManager) =>
    manager.getRepository(DonationEntity).save(donationToSave)
  );
}

export async function updateDonation(updateReq: DonationUpdateRequest, myAccount: AccountEntity): Promise<UpdateDiff<DonationEntity>> {
  const donationToSave: DonationEntity = plainToClass(DonationEntity, updateReq.donation);
  const originalDonation: DonationEntity = await readDonation(donationToSave.id);
  _validateDonation(donationToSave);
  _ensureCanUpdateDonation(donationToSave, myAccount);

  const donorOverrideAddressSame: boolean = _accountHelper.areAddressesEqual(
    donationToSave.donorContactOverride,
    originalDonation.donorContactOverride
  );
  // NOTE: Order of the next 2 lines is important! We need to process update to donor contact override before recalculating routes.
  await _preprocessDonorContactOverride(donationToSave);
  await _recalcRoutesIfAddressChange(donationToSave, donorOverrideAddressSame);

  _removeNonUpdateFields(donationToSave);
  const updatedDonation: DonationEntity = await _saveDonationUpdate(donationToSave, originalDonation, donorOverrideAddressSame);
  return { old: originalDonation, new: updatedDonation };
}

function _validateDonation(donation: Donation): void {
  const errMsg: string = _donationHelper.validateDonation(donation);
  if (errMsg) {
    throw new FoodWebError(errMsg);
  }
}

function _ensureCanUpdateDonation(donation: DonationEntity, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Update failed: ${errMsg}`);
  }
}

async function _preprocessDonorContactOverride(donation: Donation): Promise<void> {
  const donorContactOverride: ContactInfo = donation.donorContactOverride;
  if (_accountHelper.areContactInfosEqual(donorContactOverride, donation.donorAccount.contactInfo)) {
    donation.donorContactOverride = null;
  } else {
    if (donorContactOverride.id === donation.donorAccount.contactInfo.id) {
      donorContactOverride.id = undefined;
    }
    donorContactOverride.location = await geocode(donorContactOverride);
    donorContactOverride.timezone = geoTimezone(donorContactOverride.location);
    donorContactOverride.phoneNumber = _accountHelper.formatPhoneNumber(donorContactOverride.phoneNumber);
  }
}

async function _recalcRoutesIfAddressChange(donation: Donation, donorOverrideAddressSame: boolean): Promise<void> {
  if (!donorOverrideAddressSame) {
    /* NOTE: The donorContactOverride can be null just before saving,
     * since if it is the same as the donor's contact info, we don't want to actually save a copy. */
    const donorContactInfo: ContactInfo = donation.donorContactOverride
      ? donation.donorContactOverride
      : donation.donorAccount.contactInfo;
    if (donation.claim) {
      donation.claim.routeToReceiver = await genMapRoute(donorContactInfo, donation.claim.receiverAccount.contactInfo);

      if (donation.claim.delivery) {
        donation.claim.delivery.routeToDonor = await genMapRoute(donation.claim.delivery.volunteerAccount.contactInfo, donorContactInfo);
      }
    }
  }
}

function _removeNonUpdateFields(donation: Donation): void {
  // Remove fields that shouldn't be updated by the current update operation for extra security.
  delete donation.createTimestamp;
  delete donation.updateTimestamp;
  delete donation.donorAccount;
  delete donation.donationStatus;
  delete donation.claim;
}

async function _saveDonationUpdate(donation: Donation, originalDonation: DonationEntity, donorOverrideAddressSame: boolean): Promise<DonationEntity> {
  return OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    const updateResult: DonationEntity = await manager.getRepository(DonationEntity).save(donation, { mergeInto: originalDonation });

    // If we got rid of the donor contact info override on the donation, we must cleanup dangling entry.
    if (!donation.donorContactOverride && !donorOverrideAddressSame) {
      await manager.getRepository(ContactInfoEntity).remove(originalDonation.donorContactOverride);
    }

    return updateResult;
  });
}
