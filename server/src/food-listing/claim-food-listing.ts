'use strict'
import { connect, query, Client, QueryResult } from '../database_help/connection_pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';
import { FoodListing } from './food-listing';

export function claimFoodListing(claimRequest): Promise<Boolean>{

    var _foodListingKey = claimRequest.foodListingKey;
    var _requestedByAppUserKey = claimRequest.requestedByAppUserKey;

    // Build our prepared statement.
    var queryString: string = 'SELECT * FROM claimFoodListings($1, $2);';
    var queryArgs: Array<any> = [_foodListingKey, _requestedByAppUserKey];

    return query(queryString, queryArgs)
    .then((queryResult: QueryResult) =>{
        return Promise.resolve(true);
    })
    .catch((err: Error)=>{
        return Promise.reject(new Error("Incorrect FoodListing or requestedByAppUserKey"));
    });

}