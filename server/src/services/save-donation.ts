import { EntityManager, getConnection, Repository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { geocode, geoTimezone } from '../helpers/geocoder';
import { UpdateDiff } from '../interfaces/update-diff';
import { Account, AccountHelper, ContactInfo, Donation, DonationCreateRequest, DonationHelper, DonationStatus, DonationUpdateRequest } from '../shared';
import { readDonation } from './read-donations';

const _donationHelper = new DonationHelper();
const _accountHelper = new AccountHelper();

export async function createDonation(createReq: DonationCreateRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donation: Donation = createReq.donation;
  donation.donationStatus = DonationStatus.Unmatched;
  donation.donorAccount = myAccount;
  _validateDonation(donation);
  await _preprocessDonorContactOverride(donation.donorContactOverride, myAccount);

  return getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(donation)
  );
}

export async function updateDonation(updateReq: DonationUpdateRequest, myAccount: AccountEntity): Promise<UpdateDiff<Donation>> {
  const donation: Donation = updateReq.donation;
  _validateDonation(donation);
  _ensureCanUpdateDonation(donation, myAccount);
  await _preprocessDonorContactOverride(donation.donorContactOverride, myAccount);
  _removeNonUpdateFields(donation);
  const originalDonation: Donation = await readDonation(donation.id);

  const updatedDonation: Donation = await getConnection().transaction(async (manager: EntityManager) => {
    const donationRepo: Repository<DonationEntity> = manager.getRepository(DonationEntity);
    await donationRepo.save(donation);
    // Must do separate query b/c save method will only return updated properties in entity (partial entity).
    return readDonation(donation.id, donationRepo);
  });

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

async function _preprocessDonorContactOverride(donorContactOverride: ContactInfo, myAccount: AccountEntity): Promise<void> {
  if (donorContactOverride.streetAddress !== myAccount.contactInfo.streetAddress || donorContactOverride.city !== myAccount.contactInfo.city) {
    donorContactOverride.location = await geocode(donorContactOverride);
    donorContactOverride.timezone = geoTimezone(donorContactOverride.location);
  } else {
    donorContactOverride.location = myAccount.contactInfo.location;
    donorContactOverride.timezone = myAccount.contactInfo.timezone;
  }
  donorContactOverride.phoneNumber = _accountHelper.formatPhoneNumber(donorContactOverride.phoneNumber);
}

function _removeNonUpdateFields(donation: Donation): void {
  // Remove fields that shouldn't be updated by the current update operation for extra security.
  delete donation.createTimestamp;
  delete donation.updateTimestamp;
  delete donation.donorAccount;
  delete donation.donationStatus;
  delete donation.claim;
}
