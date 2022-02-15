import { plainToClass } from 'class-transformer';
import { DeliveryEntity, DonationEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { Delivery, DeliveryHelper, AdminDeliverySaveRequest, DonationStatus } from '~shared';
import { FoodWebError } from '~web/helpers/response/foodweb-error';
import { readDonation } from '~web/services/donation/read-donations';

const _deliveryHelper = new DeliveryHelper();

/**
 * Updates a donation's delivery based off of a given delivery save request.
 * @param deliverySaveReq The delivery save request.
 * @return A promise that resolves to the donation whose delivery was updated.
 */
export async function adminUpdateDelivery(deliverySaveReq: AdminDeliverySaveRequest): Promise<DonationEntity> {
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

/**
 * Gets the donation associated with a delivery that is to be updated.
 * @param donationId The ID of the donation to retrieve.
 * @return A promise that resolves to the retrieved donation.
 * @throws FoodWebError if the associated donation could not be found.
 */
async function _getAssocDonation(donationId: number): Promise<DonationEntity> {
  const donation: DonationEntity = await readDonation(donationId);
  if (!donation) {
    throw new FoodWebError(`Could not find donation associated with delivery (donationId: ${donationId})`);
  }
  return donation;
}

/**
 * Derives a donation status update based off of a given delivery's timestamp data.
 * @param delivery The delivery that will have its status updated.
 * @return The donation status update.
 */
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

/**
 * Removes a given delivery's non-updatable fields.
 * @param delivery The delivery that is to be modified.
 */
function _removeNonUpdtFields(delivery: Delivery): void {
  delete delivery?.createTimestamp;
}
