import { EntityManager, getConnection, Repository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { ContactInfoEntity } from '../entity/contact-info.entity';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { geocode, geoTimezone } from '../helpers/geocoder';
import { UpdateDiff } from '../interfaces/update-diff';
import { Account, AccountHelper, ContactInfo, Donation, DonationCreateRequest, DonationHelper, DonationStatus, DonationUpdateRequest } from '../shared';
import { readDonation } from './read-donations';
import { genMapRoute } from './gen-map-route';

const _donationHelper = new DonationHelper();
const _accountHelper = new AccountHelper();

export async function createDonation(createReq: DonationCreateRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donation: Donation = createReq.donation;
  donation.donationStatus = DonationStatus.Unmatched;
  donation.donorAccount = myAccount;
  _validateDonation(donation);
  await _preprocessDonorContactOverride(donation);

  return getConnection().transaction((manager: EntityManager) =>
    manager.getRepository(DonationEntity).save(donation)
  );
}

export async function updateDonation(updateReq: DonationUpdateRequest, myAccount: AccountEntity): Promise<UpdateDiff<DonationEntity>> {
  const donation: Donation = updateReq.donation;
  const originalDonation: DonationEntity = await readDonation(donation.id);
  _validateDonation(donation);
  _ensureCanUpdateDonation(donation, myAccount);

  const donorOverrideAddressSame: boolean = _accountHelper.areAddressesEqual(donation.donorContactOverride, originalDonation.donorContactOverride);
  // NOTE: Order of the next 2 lines is important! We need to process update to donor contact override before recalculating routes.
  await _preprocessDonorContactOverride(donation);
  await _recalcRoutesIfAddressChange(donation, donorOverrideAddressSame);

  _removeNonUpdateFields(donation);
  const updatedDonation: DonationEntity = await _saveDonationUpdate(donation, originalDonation, donorOverrideAddressSame);
  return { old: originalDonation, new: updatedDonation };
}

function _validateDonation(donation: Donation): void {
  const errMsg: string = _donationHelper.validateDonation(donation);
  if (errMsg) {
    throw new FoodWebError(errMsg);
  }
}

function _ensureCanUpdateDonation(donation: Donation, myAccount: Account): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Update failed: ${errMsg}`);
  }
}

async function _preprocessDonorContactOverride(donation: Donation): Promise<void> {
  const donorContactOverride: ContactInfo = donation.donorContactOverride;
  // If the donor contact override address that is submitted is identicle to the donor's regular address, then store null.
  if (!_accountHelper.areContactInfosEqual(donorContactOverride, donation.donorAccount.contactInfo)) {
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
    }
    if (donation.delivery) {
      donation.delivery.routeToDonor = await genMapRoute(donation.delivery.volunteerAccount.contactInfo, donorContactInfo);
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
  delete donation.delivery;
}

async function _saveDonationUpdate(donation: Donation, originalDonation: DonationEntity, donorOverrideAddressSame: boolean): Promise<DonationEntity> {
  return getConnection().transaction(async (manager: EntityManager) => {
    const donationRepo: Repository<DonationEntity> = manager.getRepository(DonationEntity);
    await donationRepo.save(donation);
    // If we got rid of the donor contact info override on the donation, we must cleanup dangling entry.
    if (!donation.donorContactOverride && !donorOverrideAddressSame) {
      await manager.getRepository(ContactInfoEntity).remove(originalDonation.donorContactOverride);
    }
    // Must do separate query b/c save method will only return updated properties in entity (partial entity).
    return readDonation(donation.id, donationRepo); // NOTE: Implicitly post-processes donation.
  });
}
