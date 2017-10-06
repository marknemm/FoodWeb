import { Request, Response } from 'express';

import { SessionData } from "../common-util/session-data";
import { addFoodListing } from './add-food-listing';
import { removeFoodListing } from "./remove-food-listing";
import { getFoodListings } from './get-food-listings';
import { getDeliveryFoodListings } from './get-delivery-food-listings';
import { getFoodTypes } from './get-food-types';
import { claimFoodListing, unclaimFoodListing } from './claim-food-listing';

import { AddFoodListingRequest, AddFoodListingResponse, FoodListingUpload } from '../../../shared/food-listings/add-food-listing-message'
import { GetFoodListingsRequest, GetFoodListingsResponse, FoodListing } from '../../../shared/food-listings/get-food-listings-message';
import { GetDeliveryFoodListingsRequest, GetDeliveryFoodListingsResponse,
         DeliveryFoodListing } from '../../../shared/food-listings/get-delivery-food-listings-message';
import { GetFoodTypesResponse } from '../../../shared/food-listings/get-food-types-message';
import { ClaimFoodListingRequest } from '../../../shared/food-listings/claim-food-listing-message';
import { LISTINGS_STATUS } from "../../../shared/food-listings/food-listings-filters";
import { FoodWebResponse } from "../../../shared/message-protocol/food-web-response";


export function handleGetFoodListings(request: Request, response: Response): void {
    
    response.setHeader('Content-Type', 'application/json');
    let getFoodListingsRequest: GetFoodListingsRequest = request.body;
    let sessionData: SessionData = SessionData.loadSessionData(request);

    getFoodListings(getFoodListingsRequest.filters, sessionData.appUserKey, sessionData.gpsCoordinates)
        .then((foodListings: FoodListing[]) => {
            response.send(new GetFoodListingsResponse(foodListings, true, 'Food Listings Successfully Retrieved'));
        })
        .catch((err: Error) => {
            response.send(new GetFoodListingsResponse(null, false, err.message));
        });
}


export function handleGetDeliveryFoodListings(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');

    let getDeliveryFoodListingsRequest: GetDeliveryFoodListingsRequest = request.body;
    let delivererAppUserKey: number = SessionData.loadSessionData(request).appUserKey;

    getDeliveryFoodListings(getDeliveryFoodListingsRequest.filters, delivererAppUserKey)
        .then((deliveryFoodListings: DeliveryFoodListing[]) => {
            response.send(new GetDeliveryFoodListingsResponse(deliveryFoodListings, true, 'Delivery Food Listings Successfully Retrieved'));
        })
        .catch((err: Error) => {
            response.send(new GetDeliveryFoodListingsResponse(null, false, err.message));
        });
}


export function handleAddFoodListing(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');
    
    let addFoodListingRequest: AddFoodListingRequest = request.body;
    // The currently logged in user must be the Donor.
    let donorAppUserKey: number = SessionData.loadSessionData(request).appUserKey;

    addFoodListing(addFoodListingRequest.foodListingUpload, donorAppUserKey)
        .then((foodListingKey: number) => {
            response.send(new AddFoodListingResponse(foodListingKey, true, 'Food Listing Added Successfully'));
        })
        .catch((err: Error) => {
            response.send(new AddFoodListingResponse(null, false, 'Food Listing Add Failed'));
        });
}


export function handleRemoveFoodListing(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');

    let removeFoodListingRequest: ClaimFoodListingRequest = request.body;
    // The currently logged in user must be the original Donor (have authority to remove Food Listing).
    let donorAppUserKey: number = SessionData.loadSessionData(request).appUserKey;

    removeFoodListing(removeFoodListingRequest.foodListingKey, donorAppUserKey)
        .then(() => {
            response.send(new FoodWebResponse(true, 'Food listing has been successfully removed.'));
        })
        .catch((err: Error) => {
            response.send(new FoodWebResponse(false, err.message));
        });
}


export function handleClaimFoodListing(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');

    let claimFoodListingRequest: ClaimFoodListingRequest = request.body;
    let claimedByAppUserKey: number = SessionData.loadSessionData(request).appUserKey;

    claimFoodListing(claimFoodListingRequest.foodListingKey, claimedByAppUserKey)
        .then(() => {
            response.send(new FoodWebResponse(true, 'Food listing has been successfully claimed.'));
        })
        .catch((err: Error) => {
            response.send(new FoodWebResponse(false, err.message));
        });
}


export function handleUnclaimFoodListing(request: Request, response: Response): void {

    response.setHeader('Content-Type', 'application/json');

    let unclaimFoodListingRequest: ClaimFoodListingRequest = request.body;
    let claimedByAppUserKey: number = SessionData.loadSessionData(request).appUserKey;

    unclaimFoodListing(unclaimFoodListingRequest.foodListingKey, claimedByAppUserKey)
        .then(() => {
            response.send(new FoodWebResponse(true, 'Food listing has been successfully unclaimed.'));
        })
        .catch((err: Error) => {
            response.send(new FoodWebResponse(false, err.message));
        });
}


export function handleGetFoodTypes(request: Request, response: Response): void {
    
    response.setHeader('Content-Type', 'application/json');

    getFoodTypes()
        .then((foodTypes: string[]) => {
            response.send(new GetFoodTypesResponse(foodTypes, true, 'Food types successfully retrieved.'));
        })
        .catch((err: Error) => {
            response.send(new GetFoodTypesResponse(null, false, err.message));
        });
}
