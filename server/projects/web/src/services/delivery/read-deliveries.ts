import { AccountEntity, DeliveryEntity, DonationEntity } from '~entity';
import { getOrmRepository, OrmRepository } from '~orm';
import { DonationReadRequest } from '~shared';
import { ListResponsePromise } from '~web/helpers/response/list-response';
import { readDonations, readMyDonations } from '../donation/read-donations';

export function readDelivery(
  deliveryId: number,
  deliveryRepo: OrmRepository<DeliveryEntity> = getOrmRepository(DeliveryEntity)
): Promise<DeliveryEntity> {
  return deliveryRepo.findOne({ id: deliveryId });
}

export function readDonationsWithDeliveries(
  request: DonationReadRequest,
  donationRepo?: OrmRepository<DonationEntity>
): ListResponsePromise<DonationEntity> {
  if (!request.donationStatus || request.donationStatus.indexOf('Unmatched') >= 0) {
    request.donationStatus = 'Matched,Scheduled,Picked Up,Complete';
  }
  return readDonations(request, donationRepo);
}

export function readUnscheduledDeliveries(
  request: DonationReadRequest,
  donationRepo?: OrmRepository<DonationEntity>
): ListResponsePromise<DonationEntity> {
  request.donationStatus = 'Matched';
  return readDonations(request, donationRepo);
}

export function readMyDeliveries(request: DonationReadRequest, myAccount: AccountEntity): ListResponsePromise<DonationEntity> {
  return readMyDonations(request, myAccount);
}
