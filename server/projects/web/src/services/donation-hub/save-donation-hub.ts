import { plainToClass } from 'class-transformer';
import { EntityManager, getConnection, Repository } from 'typeorm';
import { AccountEntity } from '~entity';
import { AccountHelper, ContactInfo } from '~shared';
import { DonationHub, DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { geocode, geoTimezone } from '~web/helpers/map/geocoder';
import { validateDonationHub, validateDonationHubUpdatePrivilege } from './validate-donation-hub';

const _accountHelper = new AccountHelper();

/**
 * Creates a new donation hub and saves it to the database.
 * @param donationHub The donation hub that is to be created.
 * @param myAccount The account of the user who is creating the donation hub.
 * @return A promise that resolves to the newly created donation hub.
 */
export async function createDonationHub(donationHub: DonationHub, myAccount: AccountEntity): Promise<DonationHubEntity> {
  return getConnection().transaction(async (manager: EntityManager) =>
    _saveDonationHub(manager, donationHub, myAccount)
  );
}

/**
 * Updates a given donation hub within the database.
 * @param donationHub The donation hub that is to be updated.
 * @param myAccount The account of the user who is updating the donation hub.
 * @return A promise that resolves to the updated donation hub.
 */
export async function updateDonationHub(donationHub: DonationHub, myAccount: AccountEntity): Promise<DonationHubEntity> {
  validateDonationHubUpdatePrivilege(donationHub, myAccount);
  return getConnection().transaction(async (manager: EntityManager) => {
    const savedDonationHub: DonationHubEntity = await _saveDonationHub(manager, donationHub, myAccount);
    return manager.getRepository(DonationHubEntity).findOne({ id: savedDonationHub.id });
  });
}

/**
 * Saves a given donation hub. The save operation serves as both a create & update operation.
 * @param manager The entity manager that will be used for the database save transaction.
 * @param donationHub The donation hub that is to be saved.
 * @param myAccount The account of the user who is saving the donation hub.
 * @return A promise that resolves to the saved donation hub.
 */
async function _saveDonationHub(manager: EntityManager, donationHub: DonationHub, myAccount?: AccountEntity): Promise<DonationHubEntity> {
  const donationHubRepo: Repository<DonationHubEntity> = manager.getRepository(DonationHubEntity);
  const preppedDonationHub: DonationHubEntity = await _prepareDonationHub(donationHub, myAccount);
  validateDonationHub(preppedDonationHub);
  return await donationHubRepo.save(preppedDonationHub);
}

/**
 * Prepares a donation hub before it is saved to the database.
 * @param donationHub The donation hub that is to be prepared.
 * @param myAccount The account of the user that is saving the donation hub.
 * @return The prepared donation hub entity.
 */
async function _prepareDonationHub(donationHub: DonationHub, myAccount: AccountEntity): Promise<DonationHubEntity> {
  const preppedDonationHub: DonationHubEntity = plainToClass(DonationHubEntity, donationHub);
  preppedDonationHub.volunteerAccount = myAccount;
  delete preppedDonationHub.pledges; // Never save pledges when saving a donation hub.
  delete preppedDonationHub.createTimestamp;
  delete preppedDonationHub.updateTimestamp;
  await _preprocessDonorContactOverride(preppedDonationHub);
  return preppedDonationHub;
}

/**
 * Preprocesses the `contactOverride` field on a given donationHub before saving it.
 * If the contact override data is the same as the `contactInfo` data on the `volunteerAccount` field,
 * then it sets the contact override data to null. Otherwise, it prepares the contact override data to be saved.
 * @param donationHub The donation hub that is to have its contact override preprocessed.
 * @return A promise that resolves once the preprocessing is finished.
 */
async function _preprocessDonorContactOverride(donationHub: DonationHubEntity): Promise<void> {
  const donorContactOverride: ContactInfo = donationHub.contactOverride;
  if (_accountHelper.areContactInfosEqual(donorContactOverride, donationHub.volunteerAccount.contactInfo)) {
    donationHub.contactOverride = null;
  } else {
    // If the donor contact override was the same as the donor's regular contact info, but it was updated,
    // then unset ID to create new ContactInfo for the override.
    if (donorContactOverride.id === donationHub.volunteerAccount.contactInfo.id) {
      donorContactOverride.id = undefined;
    }
    donorContactOverride.location = await geocode(donorContactOverride);
    donorContactOverride.timezone = geoTimezone(donorContactOverride.location);
    donorContactOverride.phoneNumber = _accountHelper.formatPhoneNumber(donorContactOverride.phoneNumber);
  }
}
