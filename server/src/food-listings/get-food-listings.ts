'use strict'
import { query, QueryResult } from '../database-util/connection-pool';
import { fixNullQueryArgs, toPostgresArray } from './../database-util/prepared-statement-util';
import { copyDatabaseOutputToObject } from './../database-util/database-output-to-object';
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
    let availableAfterDateArg: string = generateAvailableAfterArg(filters.availableAfterDate);

    // Determine if this is a donor/receiver cart or if its the receive tab (unclaimed only).
    let unclaimedListingsOnly: boolean = (filters.listingsStatus === LISTINGS_STATUS.unclaimedListings);
    let myDonatedListingsOnly: boolean = (filters.listingsStatus === LISTINGS_STATUS.myDonatedListings);
    let myClaimedListingsOnly: boolean = (filters.listingsStatus === LISTINGS_STATUS.myClaimedListings);
   
    // Build our prepared statement.
    let queryString: string = 'SELECT * FROM getFoodListings($1, $2, $3, null, $4, $5, $6, $7, $8, $9, $10);';
    let queryArgs: any[] = [ appUserKey, filters.retrievalOffset, filters.retrievalAmount,
                             foodTypesArg, perishableArg, availableAfterDateArg,
                             unclaimedListingsOnly, myDonatedListingsOnly, myClaimedListingsOnly,
                             filters.matchAvailability ];

    // Replace any NULL query arguments with literals in query string.
    queryString = fixNullQueryArgs(queryString, queryArgs);
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .then((queryResult: QueryResult) => {
            logSqlQueryResult(queryResult.rows);
            return generateResultArray(queryResult.rows, gpsCoordinates, myDonatedListingsOnly);
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error('Food listing search failed'));
        });
}


/**
 * Generates the perishablility argument.
 * @param perishable Set true if including perishable listings.
 * @param notPerishable Set true if including non-perishable listings.
 * @return true if only perishable items should be included, false if only non-perishable should be included, and null if both (don't care).
 */
function generatePerishabilityArg(perishable: boolean, notPerishable: boolean): boolean {
    // If exactly one filter is only active, then we apply filter.
    let notBoth = !(perishable && notPerishable);
    let notNeither = (perishable || notPerishable);
    if (notBoth && notNeither) {
        return perishable;
    }
    return null;
}


/**
 * Generates the available after date argument. All food must be available on or after this date.
 * @param availableAfterDate The date that food must be availalbe on or after to appear in the results.
 * @return A string in the format mm/dd/yyyy that signifies the available after date argument. If no filter, then null for don't care. 
 */
function generateAvailableAfterArg(availableAfterDate: Date): string {
    return (availableAfterDate == null) ? null
                                        : DateFormatter.dateToMonthDayYearString(availableAfterDate);
}


/**
 * Generates the result Food Listing array. All Food Listings that have met the filter criteria will be entered into this array.
 * @param rows The database function result rows.
 * @param gpsCoordinates The GPS Coordinates of the App User who is logged in and triggering the execution of this function.
 * @param myDonatedListingsOnly A flag signifying whether or not the listings that were retrieved are the logged in App User's donated items only (donor cart).
 * @return A promise that resolves the the result Food Listing array.
 */
function generateResultArray(rows: any[], gpsCoordinates: GPSCoordinates, myDonatedListingsOnly: boolean): Promise<FoodListing[]> {

    let foodListings: FoodListing[] = [];
    let donorGPSCoordinates: GPSCoordinates[] = [];
    let donorDistances: number[];

    // Go through each row of the database output (each row corresponds to a Food Listing).
    for (let i: number = 0; i < rows.length; i++) {
        
        // Copy returned data from database JSON output object to shared object.
        let foodListing: FoodListing = new FoodListing();
        copyDatabaseOutputToObject(rows[i], foodListing, 'FoodListing');

        // Insert returned data into result arrays.
        foodListings.push(foodListing);
        donorGPSCoordinates.push(new GPSCoordinates(rows[i].donororganizationlatitude, rows[i].donororganizationlongitude));
    }

    // If in Donor Cart, then we don't care about seeing driving distances!
    if (myDonatedListingsOnly)  return Promise.resolve(foodListings);

    // In Receive tab or Receiver Cart, we do care about driving distances!
    return getDrivingDistances(gpsCoordinates, donorGPSCoordinates)
        .then((distances: number[]) => {
            for (let i: number = 0; i < distances.length; i++) {
                foodListings[i].donorDrivingDistance = distances[i];
            }

            return foodListings;
        });
        // Friendly error message generated in getDrivingDistances()!
}
