import { getRepository, Repository, FindConditions } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationReadRequest, DonationReadFilters } from '../../../shared/src/interfaces/donation/donation-read-request';

export interface DonationsQueryResult {
  donations: Donation[];
  totalCount: number;
}

export async function readDonation(id: number, myAccount: AccountEntity, donationRepo?: Repository<DonationEntity>): Promise<Donation> {
  const readRequest: DonationReadRequest = { id, page: 1, limit: 1 };
  const queryResult: DonationsQueryResult = await readDonations(readRequest, myAccount, donationRepo);
  return queryResult.donations[0];
}

export function readMyDonations(request: DonationReadRequest, myAccount: AccountEntity): Promise<DonationsQueryResult> {
  _fillMyAccountRequestFilter(request, myAccount);
  return readDonations(request, myAccount);
}

function _fillMyAccountRequestFilter(request: DonationReadRequest, myAccount: AccountEntity): void {
  if (myAccount.accountType === 'Donor') {
    request.donorAccountId = myAccount.id;
    delete request.receiverAccountId;
  } else if (myAccount.accountType === 'Receiver') {
    request.receiverAccountId = myAccount.id;
    delete request.donorAccountId;
  }
  // Else, 'Admin' account type owns all accounts.
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

function _genFindConditions(request: DonationReadRequest, myAccount: AccountEntity): FindConditions<DonationEntity> {
  const findConditions: FindConditions<DonationEntity> = Object.assign({}, request);
  delete findConditions['page'];
  delete findConditions['limit'];
  _fillAccountConditions(request, findConditions, myAccount);
  return findConditions;
}

function _fillAccountConditions(filters: DonationReadFilters, findConditions: FindConditions<DonationEntity>, myAccount: AccountEntity): void {
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
