'use strict'
import { query, QueryResult } from './../database-util/connection-pool';
import { fixNullQueryArgs, toPostgresArray } from './../database-util/prepared-statement-util';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from './../logging/sql-logger';
import { getDrivingDistances, GPSCoordinates } from './../common-util/geocode';

import { DeliveryFoodListingsFilters } from './../../../shared/food-listings/delivery-food-listings-filters';
import { DeliveryFoodListing } from "./../../../shared/food-listings/delivery-food-listing";
import { DateFormatter } from "./../../../shared/common-util/date-formatter";


/**
 * Gets the Food Listings that meet a given set of filter criteria.
 * @param filters The filter criteria.
 * @param appUserKey The key identifier for the App User that is logged in (making this call).
 * @return A Promise that resolves to an array of Food Listings that have been retrieved.
 */
export function getDeliveryFoodListings(filters: DeliveryFoodListingsFilters, appUserKey: number): Promise<DeliveryFoodListing[]> {
   
    // Build our prepared statement.
    let queryString: string = 'SELECT * FROM getDeliveryFoodListings($1, $2, $3, null, $4, $5, $6);';
    let queryArgs: any[] = [ appUserKey, filters.retrievalOffset, filters.retrievalAmount,
                             filters.maxDistance, filters.maxTotalWeight, filters.myScheduledDeliveries ];

    // Replace any NULL query arguments with literals in query string.
    queryString = fixNullQueryArgs(queryString, queryArgs);
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .then((queryResult: QueryResult) => {
            logSqlQueryResult(queryResult.rows);
            return generateResultArray(queryResult.rows);
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error('Food listing search failed'));
        });
}


/**
 * Generates the result Food Listing array. All Food Listings that have met the filter criteria will be entered into this array.
 * @param rows The database function result rows.
 * @return The Delivery Food Listings array that was generated.
 */
function generateResultArray(rows: any[]): DeliveryFoodListing[] {

    let deliveryFoodListings: DeliveryFoodListing[] = [];
    let donorDistances: number[];

    // Go through each row of the database output (each row corresponds to a Food Listing).
    for (let i: number = 0; i < rows.length; i++) {
        // Insert returned data into result arrays.
        deliveryFoodListings.push(rows[i].deliveryfoodlisting);
    }

    return deliveryFoodListings;
}
