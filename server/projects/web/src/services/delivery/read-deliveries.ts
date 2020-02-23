import { AccountEntity } from 'database/src/entity/account.entity';
import { DonationEntity } from 'database/src/entity/donation.entity';
import { OrmRepository } from '~orm/index';
import { QueryResult } from '~orm/index';
import { DonationReadRequest } from '~shared';
import { readDonations, readMyDonations } from '../donation/read-donations';

export function readDeliveries(
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
