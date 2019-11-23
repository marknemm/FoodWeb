import { Repository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { QueryResult } from '../helpers/query-builder-helper';
import { DeliveryReadRequest } from '../shared';
import { readDonations, readMyDonations } from './read-donations';

export function readDeliveries(
  request: DeliveryReadRequest,
  donationRepo?: Repository<DonationEntity>
): Promise<QueryResult<DonationEntity>> {
  if (!request.donationStatus || request.donationStatus.indexOf('Unmatched') >= 0) {
    request.donationStatus = 'Matched,Scheduled,Picked Up,Complete';
  }
  return readDonations(request, donationRepo);
}

export function readUnscheduledDeliveries(
  request: DeliveryReadRequest,
  donationRepo?: Repository<DonationEntity>
): Promise<QueryResult<DonationEntity>> {
  request.donationStatus = 'Matched';
  return readDonations(request, donationRepo);
}

export function readMyDeliveries(request: DeliveryReadRequest, myAccount: AccountEntity): Promise<QueryResult<DonationEntity>> {
  return readMyDonations(request, myAccount);
}
