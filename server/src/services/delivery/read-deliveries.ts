import { AccountEntity } from '../../entity/account.entity';
import { DonationEntity } from '../../entity/donation.entity';
import { OrmRepository } from '../../helpers/database/orm';
import { QueryResult } from '../../helpers/database/query-builder-helper';
import { DeliveryReadRequest } from '../../shared';
import { readDonations, readMyDonations } from '../donation/read-donations';

export function readDeliveries(
  request: DeliveryReadRequest,
  donationRepo?: OrmRepository<DonationEntity>
): Promise<QueryResult<DonationEntity>> {
  if (!request.donationStatus || request.donationStatus.indexOf('Unmatched') >= 0) {
    request.donationStatus = 'Matched,Scheduled,Picked Up,Complete';
  }
  return readDonations(request, donationRepo);
}

export function readUnscheduledDeliveries(
  request: DeliveryReadRequest,
  donationRepo?: OrmRepository<DonationEntity>
): Promise<QueryResult<DonationEntity>> {
  request.donationStatus = 'Matched';
  return readDonations(request, donationRepo);
}

export function readMyDeliveries(request: DeliveryReadRequest, myAccount: AccountEntity): Promise<QueryResult<DonationEntity>> {
  return readMyDonations(request, myAccount);
}
