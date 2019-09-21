import { readAccounts, AccountsQueryResult } from './read-accounts';
import { AccountEntity } from '../entity/account.entity';
import { AccountType } from '../../../shared/src/interfaces/account/account';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';

export interface FoundPotentialReceivers {
  donation: Donation;
  potentialReceivers: AccountEntity[];
}

/**
 * Sends messages to potential receiver charities so that they are given a chance to claim the donation.
 * @param donation The donation that is up for claim.
 * @return A promise that resolves to the potential receivers' accounts and input donation.
 */
export async function findPotentialReceivers(donation: Donation): Promise<FoundPotentialReceivers> {
  const readRequest: AccountReadRequest = {
    page: 1,
    limit: 300,
    accountType: AccountType.Receiver,
    distanceRangeMi: 20,
    lon: donation.donorContactOverride.location.coordinates[0],
    lat: donation.donorContactOverride.location.coordinates[1],
    operationHoursRange: {
      startDateTime: donation.pickupWindowStart,
      endDateTime: donation.pickupWindowEnd
    }
  };
  const queryResult: AccountsQueryResult = await readAccounts(readRequest, donation.donorAccount);
  return { donation, potentialReceivers: queryResult.accounts };
}
