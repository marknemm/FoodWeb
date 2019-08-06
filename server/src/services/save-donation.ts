import { getConnection, EntityManager, Repository } from 'typeorm';
import { readDonation } from './read-donations';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { UpdateDiff } from '../interfaces/update-diff';
import { Account } from '../../../shared/src/interfaces/account/account';
import { Donation, DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DonationCreateRequest } from '../../../shared/src/interfaces/donation/donation-create-request';
import { DonationUpdateRequest } from '../../../shared/src/interfaces/donation/donation-update-request';

const _donationHelper = new DonationHelper();

export async function createDonation(createReq: DonationCreateRequest, myAccount: AccountEntity): Promise<DonationEntity> {
  const donation: Donation = createReq.donation;
  donation.donationStatus = DonationStatus.Unmatched;
  donation.donorAccount = myAccount;
  _validateDonation(donation);

  return getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(donation)
  );
}

export async function updateDonation(updateReq: DonationUpdateRequest, myAccount: AccountEntity): Promise<UpdateDiff<Donation>> {
  const donation: Donation = updateReq.donation;
  _validateDonation(donation);
  _ensureCanUpdateDonation(donation, myAccount);

  _removeNonUpdateFields(donation);
  const originalDonation: Donation = await readDonation(donation.id, myAccount);

  const updatedDonation: Donation = await getConnection().transaction(async (manager: EntityManager) => {
    const donationRepo: Repository<DonationEntity> = manager.getRepository(DonationEntity);
    await donationRepo.save(donation);
    // Must do separate query b/c save method will only return updated properties in entity (partial entity).
    return readDonation(donation.id, myAccount, donationRepo);
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

function _removeNonUpdateFields(donation: Donation): void {
  // Remove fields that shouldn't be updated by the current update operation for extra security.
  delete donation.createTimestamp;
  delete donation.updateTimestamp;
  delete donation.donorAccount;
  delete donation.donationStatus;
  delete donation.receiverAccount;
}
