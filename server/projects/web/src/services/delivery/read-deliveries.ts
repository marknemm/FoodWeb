import { AccountEntity, DonationEntity, DeliveryEntity } from '~entity';
import { OrmRepository, QueryResult, getOrmRepository } from '~orm';
import { DonationReadRequest } from '~shared';
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
): Promise<QueryResult<DonationEntity>> {
  if (!request.donationStatus || request.donationStatus.indexOf('Unmatched') >= 0) {
    request.donationStatus = 'Matched,Scheduled,Picked Up,Complete';
  }
  return readDonations(request, donationRepo);
}

export function readUnscheduledDeliveries(
  request: DonationReadRequest,
  donationRepo?: OrmRepository<DonationEntity>
): Promise<QueryResult<DonationEntity>> {
  request.donationStatus = 'Matched';
  return readDonations(request, donationRepo);
}

export function readMyDeliveries(request: DonationReadRequest, myAccount: AccountEntity): Promise<QueryResult<DonationEntity>> {
  return readMyDonations(request, myAccount);
}
