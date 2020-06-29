import { plainToClass } from 'class-transformer';
import { adminReadAccount } from '~admin/services/admin-account/admin-read-accounts';
import { AccountEntity, DonationEntity, DeliveryEntity, DonationClaimEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { AdminDonationSaveRequest, DateTimeRange, DonationHelper, DonationSaveData, DonationStatus } from '~shared';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { prepareScheduledDelivery } from '~web/services/delivery/schedule-delivery';
import { prepareDonationClaim } from '~web/services/donation-claim/claim-donation';
import { readDonation } from '~web/services/donation/read-donations';
import { prepareDonation } from '~web/services/donation/save-donation';
import _ = require('lodash');
import { UpdateDiff } from '~web/helpers/misc/update-diff';

const _donationHelper = new DonationHelper();

/**
 * Creates a new donation based off of a given donation create request.
 * @param createReq The donation create request.
 * @return A promise that resolves to the newly created donation once the create operation completes.
 */
export async function adminCreateDonation(createReq: AdminDonationSaveRequest): Promise<DonationEntity> {
  const donationSaveData: DonationSaveData = await _prepareDonationSaveData(createReq);
  return OrmEntityManager.transaction(
    (manager: OrmEntityManager) => manager.getRepository(DonationEntity).save(
      plainToClass(DonationEntity, donationSaveData)
    )
  );
}

/**
 * Prepares complete donation save data based off of a given donation save request.
 * Also, performs validation on the generated donation save data.
 * @param saveReq The donation save request.
 * @return A promise that resolves to the prepared donation save data.
 */
async function _prepareDonationSaveData(saveReq: AdminDonationSaveRequest): Promise<DonationSaveData> {
  const donation: DonationSaveData = await _prepareBaseDonation(saveReq);
  await _prepareDonationClaimSaveData(saveReq, donation);
  _donationHelper.validateDonation(donation);
  return donation;
}

/**
 * Prepares base donation save data based off of a given donation save request.
 * NOTE: Base donation refers to the 'basic' donation properties that belong directly to the Donation entity (excludes claim/delivery).
 * @param saveReq The donation save request.
 * @return A promise that resolves to the prepared base donation save data.
 */
async function _prepareBaseDonation(saveReq: AdminDonationSaveRequest): Promise<DonationSaveData> {
  const donorAccountId: number = saveReq.donorAccountId;
  const donorAccount: AccountEntity = await adminReadAccount(donorAccountId);
  return await prepareDonation(saveReq.donationSaveData, donorAccount);
}

/**
 * Prepares donation claim save data based off of a given donation save request, and sets it on a given donation.
 * If the save request doesn't sepcify claim data, then the donation's claim is set to null.
 * @param saveReq The donation save request.
 * @param donation The donation that will be modified.
 * @return A promise that resolves once the donation claim save data has been prepared and set.
 */
async function _prepareDonationClaimSaveData(saveReq: AdminDonationSaveRequest, donation: DonationSaveData): Promise<void> {
  const receiverAccountId: number = saveReq.claimSaveReq?.receiverAccountId;
  if (receiverAccountId != null) {
    const receiverAccount: AccountEntity = await adminReadAccount(receiverAccountId);
    donation.claim = await prepareDonationClaim(donation, receiverAccount);
    donation.donationStatus = DonationStatus.Matched;
    await _prepareDeliverySaveData(saveReq, donation);
  } else {
    donation.claim = null; // Must set to null so that if an update, then claim will be set NULL or deleted in database.
  }
}

/**
 * Prepares donation delivery save data baseed off of a given donation save request, and sets it on a given donation's claim.
 * If the save request doesn't specify delivery data, then the donation claim's delivery is set to null.
 * @param saveReq The donation save request.
 * @param donation The donation that will be modified.
 * @return A promise that resolves once the donation delivery save data has been prepared and set.
 */
async function _prepareDeliverySaveData(saveReq: AdminDonationSaveRequest, donation: DonationSaveData): Promise<void> {
  const volunteerAccountId: number = saveReq.deliverySaveReq?.volunteerAccountId;
  if (volunteerAccountId != null) {
    const volunteerAccount: AccountEntity = await adminReadAccount(volunteerAccountId);
    const pickupWindow: DateTimeRange = {
      startDateTime: saveReq.deliverySaveReq.delivery.pickupWindowStart,
      endDateTime: saveReq.deliverySaveReq.delivery.pickupWindowEnd
    };
    donation.claim.delivery = await prepareScheduledDelivery(donation, pickupWindow, volunteerAccount);
    donation.donationStatus = DonationStatus.Scheduled;
    await _prepareAdvanceDeliverySaveData(saveReq, donation);
  } else {
    donation.claim.delivery = null; // Must set to null so that if an update, then delivery will be set NULL or deleted in database.
  }
}

/**
 * Prepares donation delivery status advance save data baseed off of a given donation save request,
 * and sets it on a given donation's claim.
 * If the save request doesn't specify delivery status advance data, then the appropraite delivery status timestamp fields are set to null.
 * @param saveReq The donation save request.
 * @param donation The donation that will be modified.
 * @return A promise that resolves once the donation delivery save data has been prepared and set.
 */
async function _prepareAdvanceDeliverySaveData(saveReq: AdminDonationSaveRequest, donation: DonationSaveData): Promise<void> {
  // Must set null to each delivery stage timestamp so that each will be set to NULL in databse if they are missing.
  donation.claim.delivery.startTime = null;
  donation.claim.delivery.pickupTime = null;
  donation.claim.delivery.dropOffTime = null;

  const startTime: Date = saveReq.deliverySaveReq?.delivery?.startTime;
  if (startTime) {
    donation.claim.delivery.startTime = startTime;
    donation.donationStatus = DonationStatus.Started;

    const pickupTime: Date = saveReq.deliverySaveReq.delivery.pickupTime;
    if (pickupTime) {
      donation.claim.delivery.pickupTime = pickupTime;
      donation.donationStatus = DonationStatus.PickedUp;

      const dropOffTime: Date = saveReq.deliverySaveReq.delivery.dropOffTime;
      if (dropOffTime) {
        donation.claim.delivery.dropOffTime = dropOffTime;
        donation.donationStatus = DonationStatus.Complete;
      }
    }
  }
}

/**
 * Updates a donation described by a given donation update request.
 * @param updateReq The donation update request.
 * @return A promise that resolves to the update diff for the donation once the update completes.
 */
export async function adminUpdateDonation(updateReq: AdminDonationSaveRequest): Promise<UpdateDiff<DonationEntity>> {
  const originalDonation: DonationEntity = await readDonation(updateReq.donationSaveData.id);
  if (!originalDonation) {
    throw new FoodWebError(`Cannot update a donation that doesn't exist with ID: ${updateReq.donationSaveData.id}`);
  }

  const donationSaveData: DonationSaveData = await _prepareDonationSaveData(updateReq);
  _transferOldIDsToDonationUpdt(originalDonation, donationSaveData);
  const updatedDonation: DonationEntity = await OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    const savedDonation: DonationEntity = await manager.getRepository(DonationEntity).save(
      plainToClass(DonationEntity, donationSaveData)
    );
    await _delClaimIfUnclaimed(manager, originalDonation, savedDonation);
    await _delDeliveryIfUnscheduled(manager, originalDonation ,savedDonation);
    return savedDonation;
  });

  return { old: originalDonation, new: updatedDonation };
}

/**
 * Transfers donation, claim, & delivery IDs from a given original donation to given donation save data for an update operation.
 * This is necessary in order to prevent the creation of a new donation when persisting the save data.
 * @param originalDonation The original donation.
 * @param donationSaveData The donation save data that will be modified.
 */
function _transferOldIDsToDonationUpdt(originalDonation: DonationEntity, donationSaveData: DonationSaveData): void {
  donationSaveData.id = originalDonation.id;
  if (donationSaveData.claim && originalDonation.claim) {
    donationSaveData.claim.id = originalDonation.claim.id;
    if (donationSaveData.claim.delivery && originalDonation.claim.delivery) {
      donationSaveData.claim.delivery.id = originalDonation.claim.delivery.id;
    }
  }
}

/**
 * Deletes a donation claim if the associated donation was unclaimed during a donation update.
 * NOTE: This is very important since it prevents leakage of database memory resources.
 * @param manager The ORM entity manager that was used to save the associated donation during a donation update.
 * @param origDonation The original donation before the donation update.
 * @param savedDonation The saved donation after the donation update.
 * @return A promise that resolves once this operation completes.
 */
function _delClaimIfUnclaimed(
  manager: OrmEntityManager,
  originalDonation: DonationEntity,
  savedDonation: DonationEntity
): Promise<any> {
  return (originalDonation.claim && !savedDonation.claim)
    ? manager.getRepository(DonationClaimEntity).delete(originalDonation.claim.id)
    : Promise.resolve();
}

/**
 * Deletes a donation delivery if the associated donation had its delivery during a donation update.
 * NOTE: This is very important since it prevents leakage of database memory resources.
 * @param manager The ORM entity manager that was used to save the associated donation during a donation update.
 * @param origDonation The original donation before the donation update.
 * @param savedDonation The saved donation after the donation update.
 * @return A promise that resolves once this operation completes.
 */
function _delDeliveryIfUnscheduled(
  manager: OrmEntityManager,
  originalDonation: DonationEntity,
  savedDonation: DonationEntity
): Promise<any> {
  // Check for presence of savedDonation.claim, since deleting the claim resource will cascade to delivery if it was removed.
  return (savedDonation.claim && originalDonation.claim?.delivery && !savedDonation.claim?.delivery)
    ? manager.getRepository(DeliveryEntity).delete(originalDonation.claim.delivery.id)
    : Promise.resolve();
}
