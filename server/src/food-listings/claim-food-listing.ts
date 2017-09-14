'use strict'
import { connect, query, Client, QueryResult } from '../database-util/connection-pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { FoodListing } from './food-listing';


export function claimFoodListing(foodListingKey: number, claimedByAppUserKey: number): Promise<void> {
    return claimOrUnclaimFoodListing(foodListingKey, claimedByAppUserKey, true);
}


export function unclaimFoodListing(foodListingKey: number, claimedByAppUserKey: number): Promise<void> {
    return claimOrUnclaimFoodListing(foodListingKey, claimedByAppUserKey, false);
}


function claimOrUnclaimFoodListing(foodListingKey: number, claimedByAppUserKey: number, isClaim: boolean): Promise<void> {
    
    let queryString: string = 'SELECT * FROM ' + (isClaim ? '' : 'un') + 'claimFoodListing($1, $2)';
    let queryArgs: Array<any> = [foodListingKey, claimedByAppUserKey];

    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .then((queryResult: QueryResult) => {
            console.log((isClaim ? 'Claim' : 'Unclaim') + ' Food Listing Successful.');
            return Promise.resolve();
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error((isClaim ? 'Claim' : 'Unclaim') + ' Food Listing Unexpectedly Failed.'));
        });
}
