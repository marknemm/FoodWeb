'use strict'
import { connect, query, Client, QueryResult } from '../database-help/connection-pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { FoodListing } from './food-listing';

export function claimFoodListing(foodListingKey: number, claimedByAppUserKey: number): Promise<void>{
    // Build our prepared statement.
    let queryString: string = 'SELECT * FROM claimFoodListing($1, $2);';
    let queryArgs: Array<any> = [foodListingKey, claimedByAppUserKey];

    return query(queryString, queryArgs)
        .then((queryResult: QueryResult) =>{
            return Promise.resolve();
        })
        .catch((err: Error)=>{
            console.log(err);
            return Promise.reject(new Error('Claim Food Listing Failed'));
        });
}
