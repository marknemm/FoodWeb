import { AccountEntity } from '../entity/account.entity';
import { QueryResult } from '../helpers/query-builder-helper';
import { AccountReadRequest, AccountType, Donation } from '../shared';
import { readAccounts } from './read-accounts';

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
  const queryResult: QueryResult<AccountEntity> = await readAccounts(readRequest, donation.receiverAccount);
  return { donation, potentialDeliverers: queryResult.entities };
}
