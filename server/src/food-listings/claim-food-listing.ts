'use strict'
import { connect, query, Client, QueryResult } from '../database-help/connection-pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { FoodListing } from './food-listing';

export function claimFoodListing(claimRequest): Promise<Boolean>{

    var _foodListingKey = claimRequest.foodListingKey;
    var _requestedByAppUserKey = claimRequest.requestedByAppUserKey;

    // Build our prepared statement.
    var queryString: string = 'SELECT * FROM claimFoodListing($1, $2);';
    var queryArgs: Array<any> = [_foodListingKey, _requestedByAppUserKey];

    return query(queryString, queryArgs)
    .then((queryResult: QueryResult) =>{
        return Promise.resolve(true);
    })
    .catch((err: Error)=>{
        console.log(err);
        return Promise.reject(new Error("Incorrect FoodListing or requestedByAppUserKey"));
    });

}