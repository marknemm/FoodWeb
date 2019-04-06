import { getRepository, Repository, FindConditions } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { DonationReadFilters } from '../../../shared/src/interfaces/donation/donation-read-filters';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationReadRequest } from '../interfaces/donation/donation-read-request';

export interface DonationsQueryResult {
  donations: Donation[];
  totalCount: number;
}

export async function readDonation(id: number, myAccount: AccountEntity, donationRepo?: Repository<DonationEntity>): Promise<Donation> {
  const readRequest: DonationReadRequest = { id, page: 1, limit: 1 };
  const queryResult: DonationsQueryResult = await readDonations(readRequest, myAccount, donationRepo);
  return queryResult.donations[0];
}

export async function readDonations(
  request: DonationReadRequest,
  myAccount: AccountEntity,
  donationRepo: Repository<DonationEntity> = getRepository(DonationEntity)
): Promise<DonationsQueryResult> {
  const where: FindConditions<DonationEntity> = _genFindConditions(request, myAccount);
  const [donations, totalCount]: [DonationEntity[], number] = await donationRepo.findAndCount({
    relations: ['donorAccount', 'receiverAccount'],
    where,
    skip: (request.page - 1) * request.limit,
    take: request.limit,
    order: { donationStatus: 'DESC', id: 'ASC' }
  });

  _postProcessDonations(donations);
  return { donations, totalCount };
}

function _genFindConditions(filters: DonationReadFilters, myAccount: AccountEntity): FindConditions<DonationEntity> {
  const findConditions: FindConditions<DonationEntity> = filters;
  _fillAccountConditions(filters, findConditions, myAccount);
  return findConditions;
}

function _fillAccountConditions(filters: DonationReadFilters, findConditions: FindConditions<DonationEntity>, myAccount: AccountEntity): void {
  // If all account filters are empty and we are not an admin account, then filter to our account.
  if (filters.donorAccountId == null && filters.receiverAccountId == null) {
    if (myAccount.accountType === 'Donor') {
      filters.donorAccountId = myAccount.id;
    } else if (myAccount.accountType === 'Receiver') {
      filters.receiverAccountId = myAccount.id;
    }
  }

  if (filters.donorAccountId != null) {
    findConditions.donorAccount = { id: filters.donorAccountId };
  }
  if (filters.receiverAccountId != null) {
    findConditions.receiverAccount = { id: filters.receiverAccountId };
  }
}

function _postProcessDonations(donations: DonationEntity[]): void {
  donations.forEach((donation: DonationEntity) => {
    _formatAccountOperationHours(donation);
    _processDonationTimestamps(donation);
  });
}

function _formatAccountOperationHours(donation: DonationEntity): void {
  formatOperationHoursTimes(donation.donorAccount.operationHours);
  if (donation.receiverAccount) {
    formatOperationHoursTimes(donation.receiverAccount.operationHours);
  }
}

function _processDonationTimestamps(donation: DonationEntity): void {
  (<Donation>donation).lastUpdated = donation.updateTimestamp.toJSON();
  (<Donation>donation).created = donation.createTimestamp.toJSON();
}
