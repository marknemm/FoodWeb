import { readAccounts, AccountsQueryResult } from './read-accounts';
import { AccountEntity } from '../entity/account.entity';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { AccountType } from '../../../shared/src/interfaces/account/account';
import { Donation } from '../../../shared/src/interfaces/donation/donation';

export interface FoundPotentialDeliverers {
  donation: Donation;
  potentialDeliverers: AccountEntity[];
}

/**
 * Gets all potential deliverers for a donation so that they can be messaged for a chance to begin/schedule the delivery.
 * @return A promise that resolves to the found potential deliverers.
 */
export async function findPotentialDeliverers(donation: Donation): Promise<FoundPotentialDeliverers> {
  const readRequest: AccountReadRequest = {
    page: 1,
    limit: 300,
    accountType: AccountType.Volunteer,
    distanceRangeMi: 20,
    operationHoursRange: {
      startDateTime: donation.pickupWindowStart,
      endDateTime: donation.pickupWindowEnd
    }
  };
  const queryResult: AccountsQueryResult = await readAccounts(readRequest, donation.receiverAccount);
  return { donation, potentialDeliverers: queryResult.accounts };
}
