import { plainToClass } from 'class-transformer';
import { adminReadAccount } from '~admin/services/admin-account/admin-read-accounts';
import { AccountEntity, DonationEntity } from '~entity';
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

export async function adminCreateDonation(createReq: AdminDonationSaveRequest): Promise<DonationEntity> {
  const donationSaveData: DonationSaveData = await _prepareDonationSaveData(createReq);
  return OrmEntityManager.transaction(
    (manager: OrmEntityManager) => manager.getRepository(DonationEntity).save(
      plainToClass(DonationEntity, donationSaveData)
    )
  );
}

async function _prepareDonationSaveData(createReq: AdminDonationSaveRequest): Promise<DonationSaveData> {
  const donation: DonationSaveData = await _prepareBaseDonation(createReq);
  await _prepareDonationClaimSaveData(createReq, donation);
  _donationHelper.validateDonation(donation);
  return donation;
}

async function _prepareBaseDonation(createReq: AdminDonationSaveRequest): Promise<DonationSaveData> {
  const donorAccountId: number = createReq.donorAccountId;
  const donorAccount: AccountEntity = await adminReadAccount(donorAccountId);
  return await prepareDonation(createReq.donationSaveData, donorAccount);
}

async function _prepareDonationClaimSaveData(createReq: AdminDonationSaveRequest, donation: DonationSaveData): Promise<void> {
  const receiverAccountId: number = createReq.claimSaveReq?.receiverAccountId;
  if (receiverAccountId != null) {
    const receiverAccount: AccountEntity = await adminReadAccount(receiverAccountId);
    donation.claim = await prepareDonationClaim(donation, receiverAccount);
    donation.donationStatus = DonationStatus.Matched;
    await _prepareDeliverySaveData(createReq, donation);
  } else {
    donation.claim = null; // Must set to null so that if an update, then claim will be set NULL or deleted in database.
  }
}

async function _prepareDeliverySaveData(createReq: AdminDonationSaveRequest, donation: DonationSaveData): Promise<void> {
  const volunteerAccountId: number = createReq.deliverySaveReq?.volunteerAccountId;
  if (volunteerAccountId != null) {
    const volunteerAccount: AccountEntity = await adminReadAccount(volunteerAccountId);
    const pickupWindow: DateTimeRange = {
      startDateTime: createReq.deliverySaveReq.delivery.pickupWindowStart,
      endDateTime: createReq.deliverySaveReq.delivery.pickupWindowEnd
    };
    donation.claim.delivery = await prepareScheduledDelivery(donation, pickupWindow, volunteerAccount);
    donation.donationStatus = DonationStatus.Scheduled;
    await _prepareAdvanceDeliverySaveData(createReq, donation);
  } else {
    donation.claim.delivery = null; // Must set to null so that if an update, then delivery will be set NULL or deleted in database.
  }
}

async function _prepareAdvanceDeliverySaveData(createReq: AdminDonationSaveRequest, donation: DonationSaveData): Promise<void> {
  // Must set null to each delivery stage timestamp so that each will be set to NULL in databse if they are missing.
  donation.claim.delivery.startTime = null;
  donation.claim.delivery.pickupTime = null;
  donation.claim.delivery.dropOffTime = null;

  const startTime: Date = createReq.deliverySaveReq?.delivery?.startTime;
  if (startTime) {
    donation.claim.delivery.startTime = startTime;
    donation.donationStatus = DonationStatus.Started;

    const pickupTime: Date = createReq.deliverySaveReq.delivery.pickupTime;
    if (pickupTime) {
      donation.claim.delivery.pickupTime = pickupTime;
      donation.donationStatus = DonationStatus.PickedUp;

      const dropOffTime: Date = createReq.deliverySaveReq.delivery.dropOffTime;
      if (dropOffTime) {
        donation.claim.delivery.dropOffTime = dropOffTime;
        donation.donationStatus = DonationStatus.Complete;
      }
    }
  }
}

export async function adminUpdateDonation(donationSaveReq: AdminDonationSaveRequest): Promise<UpdateDiff<DonationEntity>> {
  const originalDonation: DonationEntity = await readDonation(donationSaveReq.donationSaveData.id);
  if (!originalDonation) {
    throw new FoodWebError(`Cannot update a donation that doesn't exist with ID: ${donationSaveReq.donationSaveData.id}`);
  }

  const donationSaveData: DonationSaveData = await _prepareDonationSaveData(donationSaveReq);
  _transferOldIDsToDonationUpdt(originalDonation, donationSaveData);
  const updatedDonation: DonationEntity = await OrmEntityManager.transaction(
    (manager: OrmEntityManager) => manager.getRepository(DonationEntity).save(
      plainToClass(DonationEntity, donationSaveData)
    )
  );

  return { old: originalDonation, new: updatedDonation };
}

function _transferOldIDsToDonationUpdt(originalDonation: DonationEntity, donationSaveData: DonationSaveData): void {
  donationSaveData.id = originalDonation.id;
  if (donationSaveData.claim && originalDonation.claim) {
    donationSaveData.claim.id = originalDonation.claim.id;
    if (donationSaveData.claim.delivery && originalDonation.claim.delivery) {
      donationSaveData.claim.delivery.id = originalDonation.claim.delivery.id;
    }
  }
}
