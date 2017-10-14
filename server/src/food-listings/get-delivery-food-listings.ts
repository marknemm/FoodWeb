'use strict'
import { query, QueryResult } from './../database-util/connection-pool';
import { fixNullQueryArgs, toPostgresArray } from './../database-util/prepared-statement-util';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from './../logging/sql-logger';

import { getDrivingDistances, GPSCoordinate } from './../../../shared/common-util/geocode';
import { DeliveryFoodListingsFilters } from './../../../shared/food-listings/delivery-food-listings-filters';
import { DeliveryFoodListing } from "./../../../shared/food-listings/delivery-food-listing";
import { DateFormatter } from "./../../../shared/common-util/date-formatter";


/**
 * Gets the Food Listings that meet a given set of filter criteria.
 * @param filters The filter criteria.
 * @param myAppUserKey The key identifier for the App User that is logged in (making this call).
 * @param myGPSCoordinate The GPS Coordinates of the organization associated with the App User this is logged in (making this call).
 * @return A Promise that resolves to an array of Food Listings that have been retrieved.
 */
export function getDeliveryFoodListings(filters: DeliveryFoodListingsFilters, myAppUserKey: number, myGPSCoordinate: GPSCoordinate): Promise<DeliveryFoodListing[]> {
   
    // Build our prepared statement.
    let queryString: string = 'SELECT * FROM getDeliveryFoodListings($1, $2, $3, null, $4, $5, $6);';
    let queryArgs: any[] = [ myAppUserKey, filters.retrievalOffset, filters.retrievalAmount,
                             filters.maxDistance, filters.maxTotalWeight, filters.myScheduledDeliveries ];

    // Replace any NULL query arguments with literals in query string.
    queryString = fixNullQueryArgs(queryString, queryArgs);
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
        .then((queryResult: QueryResult) => {
            logSqlQueryResult(queryResult.rows);
            return generateResultArray(queryResult.rows, myGPSCoordinate);
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
function generateResultArray(rows: any[], myGPSCoordinate: GPSCoordinate): Promise<DeliveryFoodListing[]> {

    let deliveryFoodListings: DeliveryFoodListing[] = [];
    let donorGPSCoordinates: GPSCoordinate[] = [];
    let receiverGPSCoordinates: GPSCoordinate[] = [];

    // Go through each row of the database output (each row corresponds to a Food Listing).
    for (let i: number = 0; i < rows.length; i++) {

        // Insert returned data into result arrays.
        deliveryFoodListings.push(rows[i].deliveryfoodlisting);
        donorGPSCoordinates.push(rows[i].donorgpscoordinate);
        receiverGPSCoordinates.push(rows[i].receivergpscoordinate);
    }

    return getFullTripDrivingDistances(deliveryFoodListings, myGPSCoordinate, donorGPSCoordinates, receiverGPSCoordinates);
}


/**
 * Gets the full delivery trip's driving distances for segments from Deliverer origin to Donor and from Donor to Receiver.
 * Fills in the distance information in each Delivery Food Listing provided to this function.
 * @param deliveryFoodListings The Delivery Food Listing objects that have been retreived but have not yet had distance information filled in yet.
 * @param myGPSCoordinate The GPS Coordinate of the logged in user (deliverer).
 * @param donorGPSCoordinates The GPS Coordinates of the donors.
 * @param receivergpscoordinates The GPS Coordinates of the receivers.
 * @return A promise that resolves to the Delivery Food Listings array that was passed in with filled in distance data.
 */
function getFullTripDrivingDistances(deliveryFoodListings: DeliveryFoodListing[], myGPSCoordinate: GPSCoordinate,
                                     donorGPSCoordinates: GPSCoordinate[], receivergpscoordinates: GPSCoordinate[]): Promise<DeliveryFoodListing[]>
{
    return getDrivingDistancesToDonors(deliveryFoodListings, myGPSCoordinate, donorGPSCoordinates)
        .then((deliveryFoodListings: DeliveryFoodListing[]) => {
            return getDrivingDistancesFromReceiversToDonors(deliveryFoodListings, donorGPSCoordinates, receivergpscoordinates);
        });
}


/**
 * Gets the driving distances from the Deliverer origin to each Donor.
 * Fills in the distance information in each Delivery Food Listing provided to this function.
 * @param deliveryFoodListings The Delivery Food Listing objects that have been retreived but have not yet had distance information filled in yet.
 * @param myGPSCoordinate The GPS Coordinate of the logged in user (deliverer).
 * @param donorGPSCoordinates The GPS Coordinates of the donors.
 * @return A promise that resolves to the Delivery Food Listings array that was passed in, but with added filled in to-donor distance data.
 */
function getDrivingDistancesToDonors(deliveryFoodListings: DeliveryFoodListing[], myGPSCoordinate: GPSCoordinate,
                                     donorGPSCoordinates: GPSCoordinate[]): Promise<DeliveryFoodListing[]>
{
    return getDrivingDistances(myGPSCoordinate, donorGPSCoordinates)
        .then((distances: number[]) => {
            for (let i: number = 0; i < distances.length; i++) {
                deliveryFoodListings[i].donorDrivingDistance = distances[i];
            }

            return deliveryFoodListings;
        });
}


/**
 * Gets the driving distances from the Donors to corresponding Receivers (Donor-Receiver pairs).
 * Fills in the distance information in each Delivery Food Listing provided to this function.
 * @param deliveryFoodListings The Delivery Food Listing objects that have been retreived but have not yet had donor to receiver distance information filled in yet.
 * @param donorGPSCoordinates The GPS Coordinates of the donors.
 * @param receiverGPSCoordinates The GPS Coordinates of the receivers.
 * @return A promise that resolves to the Delivery Food Listings array that was passed in, but with added filled in donor-to-receiver distance data.
 */
function getDrivingDistancesFromReceiversToDonors(deliveryFoodListings: DeliveryFoodListing[], donorGPSCoordinates: GPSCoordinate[],
                                                  receiverGPSCoordinates: GPSCoordinate[]): Promise<DeliveryFoodListing[]>
{
    // TODO: Look for a way to do this in batch (multiple separate network requests are inefficient).
    for (let i: number = 0; i < deliveryFoodListings.length; i++) {
        
        let index: number = i; // Must record unique index for this for loop iteration in local scope when referring to it in Promise (callback)!
        
        getDrivingDistances(donorGPSCoordinates[i], [receiverGPSCoordinates[i]])
            .then((distances: number[]) => {
                deliveryFoodListings[index].donorToReceiverDrivingDistance = distances[0];
            })
    }

    return Promise.resolve(deliveryFoodListings);
}
