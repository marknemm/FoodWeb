'use strict'
import { connect, query, Client, QueryResult } from '../database-util/connection-pool';
import { fixNullQueryArgs, toPostgresArray } from './../database-util/prepared-statement-util';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { FoodListingsFilters, LISTINGS_STATUS } from '../../../shared/food-listings/food-listings-filters';
import { FoodListing } from "../../../shared/food-listings/food-listing";
import { DateFormatter } from "../../../shared/common-util/date-formatter";
let postgresArray = require('postgres-array');


export function getFoodListings(filters: FoodListingsFilters, appUserKey: number): Promise<Array<FoodListing>> {

    let perishableArg: boolean = generatePerishabilityArg(filters.perishable, filters.notPerishable);
    let foodTypesArg: string = toPostgresArray(filters.foodTypes);
    // Important to wrap the received JSON stringified Date object in a new Date object (one we receive will not contain Date methods)!
    let availableAfterDateArg: string = generateExpireDateArg(new Date(filters.availableAfterDate));
   
    // Build our prepared statement.
    let queryString: string = 'SELECT * FROM getFoodListings($1, $2, $3, null, $4, $5, $6, $7, $8, $9, $10);';
    let queryArgs: Array<any> = [ appUserKey, filters.retrievalOffset, filters.retrievalAmount,
                                  foodTypesArg, perishableArg, availableAfterDateArg,
                                  (filters.listingsStatus === LISTINGS_STATUS.unclaimedListings),
                                  (filters.listingsStatus === LISTINGS_STATUS.myDonatedListings),
                                  (filters.listingsStatus === LISTINGS_STATUS.myClaimedListings),
                                  filters.matchAvailability ];

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
    return (earliestExpireDate == null) ? null
                                        : DateFormatter.dateToMonthDayYearString(earliestExpireDate);
}


function generateResultArray(rows: Array<any>): Array<FoodListing> {
    let result: Array<FoodListing> = [];

    for (let i: number = 0; i < rows.length; i++) {
        result.push(new FoodListing(
            rows[i].foodlistingkey,
            rows[i].foodtitle,
            rows[i].donororganizationname,
            rows[i].donororganizationaddress,
            rows[i].donororganizationcity,
            rows[i].donororganizationstate,
            rows[i].donororganizationzip,
            rows[i].donorlastname,
            rows[i].donorfirstname,
            null,
            postgresArray.parse(rows[i].foodtypes),
            rows[i].fooddescription,
            rows[i].perishable,
            rows[i].availableuntildate,
            rows[i].imgurl             
        ));
    }

    return result;
}