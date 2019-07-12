import { getConnection, EntityManager } from 'typeorm';
import { readDonation } from './read-donations';
import { sendDonationDeleteSuccessEmail } from './delete-donation-message';
import { saveAudit, getAuditAccounts } from './save-audit';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { DeliveryEntity } from '../entity/delivery-entity';
import { FoodWebError } from '../helpers/food-web-error';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { DonationDeleteRequest } from '../../../shared/src/interfaces/donation/donation-delete-request';

const _donationHelper = new DonationHelper();

export async function deleteDonation(deleteReq: DonationDeleteRequest, myAccount: AccountEntity): Promise<void> {
  const donation = <DonationEntity> await readDonation(deleteReq.donationId, myAccount);
  _ensureCanDeleteDonation(donation, myAccount);

  await getConnection().transaction(async (manager: EntityManager) => {
    if (donation.delivery) {
      await manager.getRepository(DeliveryEntity).remove(donation.delivery);
    }
    await manager.getRepository(DonationEntity).remove(donation);
  });

  saveAudit('Remove Donation', getAuditAccounts(donation), {}, donation, deleteReq.recaptchaScore);
  await sendDonationDeleteSuccessEmail(donation);
}

function _ensureCanDeleteDonation(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _donationHelper.validateDonationEditPrivilege(donation, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delete failed: ${errMsg}`);
  }
}
