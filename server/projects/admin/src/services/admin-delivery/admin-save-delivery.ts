import { plainToClass } from 'class-transformer';
import { DeliveryEntity, DonationEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { Delivery, DeliveryHelper, AdminDeliverySaveRequest, DonationStatus } from '~shared';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { readDonation } from '~web/services/donation/read-donations';

const _deliveryHelper = new DeliveryHelper();

export async function updateDelivery(deliverySaveReq: AdminDeliverySaveRequest): Promise<DonationEntity> {
  const delivery: DeliveryEntity = plainToClass(DeliveryEntity, deliverySaveReq.delivery);
  const originalDonation: DonationEntity = await _getAssocDonation(deliverySaveReq.donationId);
  const donationStatusUpdt: DonationStatus = _deriveDonationStatusUpdt(delivery);
  _deliveryHelper.validateDelivery(delivery, donationStatusUpdt);
  _removeNonUpdtFields(delivery);
  return OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    const donation: DonationEntity = await manager.getRepository(DonationEntity).save(
      { id: originalDonation.id, donationStatus: donationStatusUpdt },
      { mergeInto: originalDonation }
    );
    donation.claim.delivery = await manager.getRepository(DeliveryEntity).save(delivery);
    return donation;
  });
}

async function _getAssocDonation(donationId: number): Promise<DonationEntity> {
  const donation: DonationEntity = await readDonation(donationId);
  if (!donation) {
    throw new FoodWebError(`Could not find donation associated with delivery (donationId: ${donationId})`);
  }
  return donation;
}

function _deriveDonationStatusUpdt(delivery: DeliveryEntity): DonationStatus {
  if (delivery.dropOffTime) {
    return DonationStatus.Complete;
  }
  if (delivery.pickupTime) {
    return DonationStatus.PickedUp;
  }
  if (delivery.startTime) {
    return DonationStatus.Started;
  }
  return DonationStatus.Scheduled;
}

function _removeNonUpdtFields(delivery: Delivery): void {
  delete delivery?.createTimestamp;
}
