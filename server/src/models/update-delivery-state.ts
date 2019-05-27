import { getConnection, EntityManager } from 'typeorm';
import { readDonation } from './read-donations';
import { FoodWebError } from '../helpers/food-web-error';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';
import { DeliveryEntity } from '../entity/delivery-entity';

const _donationHelper = new DonationHelper();
const _deliveryHelper = new DeliveryHelper();

export async function advanceDeliveryState(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(donationId);
  _ensureCanAdvanceDeliveryState(donation, myAccount);
  donation.donationStatus = _donationHelper.getNextDonationStatus(donation);
  _updateDeliveryTiming(donation);

  let advancedDonation: Donation;
  await getConnection().transaction(async (manager: EntityManager) => {
    advancedDonation = await manager.getRepository(DonationEntity).save(donation);
  });
  return advancedDonation;
}

function _ensureCanAdvanceDeliveryState(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryAdvancePrivilege(donation.delivery, donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery state advancement failed: ${errMsg}`);
  }
}

function _updateDeliveryTiming(donation: DonationEntity): void {
  if (donation.donationStatus === 'Scheduled') {
    donation.delivery.pickupTime = null;
  }
  if (donation.donationStatus === 'Picked Up') {
    donation.delivery.pickupTime = (new Date()).toUTCString();
    donation.delivery.dropOffTime = null;
  }
  if (donation.donationStatus === 'Complete') {
    donation.delivery.dropOffTime = (new Date()).toUTCString();
  }
}

export async function undoDeliveryState(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(donationId);
  _ensureCanUndoDeliveryState(donation, myAccount);
  donation.donationStatus = _donationHelper.getPrevDonationStatus(donation);
  _updateDeliveryTiming(donation);

  let undoneDonation: Donation;
  await getConnection().transaction(async (manager: EntityManager) => {
    undoneDonation = await manager.getRepository(DonationEntity).save(donation);
    // Delete the delivery if going from 'Scheduled' to 'Matched' status.
    if (donation.donationStatus === 'Matched') {
      await manager.getRepository(DeliveryEntity).delete(donation.delivery.id);
      donation.delivery = null;
    }
  });
  return undoneDonation;
}

function _ensureCanUndoDeliveryState(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliveryUndoPrivilege(donation.delivery, donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery state undo failed: ${errMsg}`);
  }
}
