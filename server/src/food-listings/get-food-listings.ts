'use strict'
import { query, QueryResult } from '../database-util/connection-pool';
import { fixNullQueryArgs, toPostgresArray } from './../database-util/prepared-statement-util';
import { copyDatabaseOutputToSharedObject } from './../database-util/database-output-to-shared-object';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql-logger';
import { getDrivingDistances, GPSCoordinates } from '../common-util/geocode';

import { FoodListingsFilters, LISTINGS_STATUS } from '../../../shared/food-listings/food-listings-filters';
import { FoodListing } from "../../../shared/food-listings/food-listing";
import { DateFormatter } from "../../../shared/common-util/date-formatter";


/**
 * Gets the Food Listings that meet a given set of filter criteria.
 * @param filters The filter criteria.
 * @param appUserKey The key identifier for the App User that is logged in (making this call).
 * @param gpsCoordinates The GPS Coordinates of the organization associated with the App User this is logged in (making this call).
 * @return A Promise that resolves to an array of Food Listings that have been retrieved.
 */
export function getFoodListings(filters: FoodListingsFilters, appUserKey: number, gpsCoordinates: GPSCoordinates): Promise<FoodListing[]> {

    let perishableArg: boolean = generatePerishabilityArg(filters.perishable, filters.notPerishable);
    let foodTypesArg: string = toPostgresArray(filters.foodTypes);
    // Important to wrap the received JSON stringified Date object in a new Date object (one we receive will not contain Date methods)!
    let availableAfterDateArg: string = generateExpireDateArg(new Date(filters.availableAfterDate));
   
    // Build our prepared statement.
    let queryString: string = 'SELECT * FROM getFoodListings($1, $2, $3, null, $4, $5, $6, $7, $8, $9, $10);';
    let queryArgs: any[] = [ appUserKey, filters.retrievalOffset, filters.retrievalAmount,
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
            logSqlQueryResult(queryResult.rows);
            return generateResultArray(queryResult.rows, gpsCoordinates);
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


function generateResultArray(rows: any[], gpsCoordinates: GPSCoordinates): Promise<FoodListing[]> {

    let foodListings: FoodListing[] = [];
    let donorGPSCoordinates: GPSCoordinates[] = [];
    let donorDistances: number[];

    // Go through each row of the database output (each row corresponds to a Food Listing).
    for (let i: number = 0; i < rows.length; i++) {
        
        // Copy returned data from database JSON output object to shared object.
        let foodListing: FoodListing = new FoodListing();
        copyDatabaseOutputToSharedObject(rows[i], foodListing, 'FoodListing');

        // Insert returned data into result arrays.
        foodListings.push(foodListing);
        donorGPSCoordinates.push(new GPSCoordinates(rows[i].donororganizationlatitude, rows[i].donororganizationlongitude));
    }

    return getDrivingDistances(gpsCoordinates, donorGPSCoordinates)
        .then((distances: number[]) => {
            for (let i: number = 0; i < distances.length; i++) {
                foodListings[i].donorDrivingDistance = distances[i];
            }

            return foodListings;
        });
        // Friendly error message generated in getDrivingDistances()!
}
