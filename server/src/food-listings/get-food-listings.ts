'use strict'
import { connect, query, Client, QueryResult } from '../database-util/connection-pool';
import { fixNullQueryArgs, toPostgresArray } from './../database-util/prepared-statement-util';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { FoodListingsFilters, LISTINGS_STATUS } from '../../../shared/food-listings/food-listings-filters';
import { FoodListing } from "../../../shared/food-listings/food-listing";


export function getFoodListings(filters: FoodListingsFilters, donatedByAppUserKey: number, claimedByAppUserKey: number): Promise<Array<FoodListing>> {

    let perishableArg: boolean = generatePerishabilityArg(filters.perishable, filters.notPerishable);
    let foodTypesArg: string = toPostgresArray(filters.foodTypes);
    // Important to wrap the received JSON stringified Date object in a new Date object (one we receive will not contain Date methods)!
    let expireDateArg: string = generateExpireDateArg(new Date(filters.earliestExpireDate));
   
    // Build our prepared statement.
    let queryString: string = 'SELECT * FROM getFoodListings($1, $2, null, $3, $4, $5, $6, $7, $8);';
    let queryArgs: Array<any> = [ filters.retrievalOffset, filters.retrievalAmount,
                                  (filters.listingsStatus === LISTINGS_STATUS.unclaimedListings), foodTypesArg,
                                  perishableArg, expireDateArg, donatedByAppUserKey, claimedByAppUserKey ];

    // Replace any NULL query arguments with literals in query string.
    queryString = fixNullQueryArgs(queryString, queryArgs);
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .then((queryResult: QueryResult) => {
            // Generate result array and return it.
            logSqlQueryResult(queryResult.rows);
            let resultArray: Array<object> = generateResultArray(queryResult.rows);
            return Promise.resolve(resultArray);
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error('Food listing search failed'));
        });
}


function generatePerishabilityArg(perishable: boolean, notPerishable: boolean): boolean {
    // If exactly one filter is only active, then we apply filter.
    let notBoth = !(perishable && notPerishable);
    let notNeither = (perishable || notPerishable);
    if (notBoth && notNeither) {
        return perishable;
    }
    return null;
}


function generateExpireDateArg(earliestExpireDate: Date): string {
    if (earliestExpireDate == null)  return null;
    return (earliestExpireDate.getMonth() + '/' + earliestExpireDate.getDate() + '/' + earliestExpireDate.getFullYear());
}


function generateResultArray(rows: Array<any>): Array<FoodListing> {
    let result: Array<FoodListing> = [];

    for (let i: number = 0; i < rows.length; i++) {
        result.push(new FoodListing(
            rows[i].foodlistingkey,
            rows[i].donororganizationname,
            rows[i].donororganizationaddress,
            rows[i].donororganizationcity,
            rows[i].donororganizationstate,
            rows[i].donororganizationzip,
            rows[i].donorlastname,
            rows[i].donorfirstname,
            null,
            rows[i].foodtypes,
            rows[i].fooddescription,
            null,
            rows[i].perishable,
            rows[i].expiredate,
            rows[i].imgurl             
        ));
    }

    return result;
}