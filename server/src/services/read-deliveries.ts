import { Repository } from 'typeorm';
import { DonationsQueryResult, readDonations, readMyDonations } from './read-donations';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { DeliveryReadRequest } from '../shared';

export function readDeliveries(
  request: DeliveryReadRequest,
  myAccount: AccountEntity,
  donationRepo?: Repository<DonationEntity>
): Promise<DonationsQueryResult> {
  if (!request.donationStatus || request.donationStatus.indexOf('Unmatched') >= 0) {
    request.donationStatus = 'Matched,Scheduled,Picked Up,Complete';
  }
  return readDonations(request, donationRepo);
}

export function readUnscheduledDeliveries(
  request: DeliveryReadRequest,
  myAccount: AccountEntity,
  donationRepo?: Repository<DonationEntity>
): Promise<DonationsQueryResult> {
  request.donationStatus = 'Matched';
  return readDonations(request, donationRepo);
}

export function readMyDeliveries(request: DeliveryReadRequest, myAccount: AccountEntity): Promise<DonationsQueryResult> {
  return readMyDonations(request, myAccount);
}
