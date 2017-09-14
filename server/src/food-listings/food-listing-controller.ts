import { Request, Response } from 'express';

import { SessionData } from "../common-util/session-data";
import { addFoodListing } from './add-food-listing';
import { removeFoodListing } from "./remove-food-listing";
import { getFoodListings } from './get-food-listings';
import { getFoodTypes } from './get-food-types';
import { claimFoodListing, unclaimFoodListing } from './claim-food-listing';

import { AddFoodListingRequest, AddFoodListingResponse, FoodListingUpload } from '../../../shared/food-listings/add-food-listing-message'
import { GetFoodListingsRequest, GetFoodListingsResponse, FoodListing } from '../../../shared/food-listings/get-food-listings-message';
import { GetFoodTypesResponse } from '../../../shared/food-listings/get-food-types-message';
import { ClaimFoodListingRequest } from '../../../shared/food-listings/claim-food-listing-message';
import { LISTINGS_STATUS } from "../../../shared/food-listings/food-listings-filters";
import { FoodWebResponse } from "../../../shared/message-protocol/food-web-response";


export function handleGetReceiverFoodListings(request: Request, response: Response): void {
    handleGetFoodListings(request.body, response);
}


export function handleGetCartFoodListings(request: Request, response: Response): void {

    let getCartFoodListingsRequest: GetFoodListingsRequest = request.body;
    let listingsStatus: LISTINGS_STATUS = getCartFoodListingsRequest.filters.listingsStatus;
    let sessionData: SessionData = SessionData.loadSessionData(request);
    let claimedByAppUserKey = null;
    let donatedByAppUserKey = null;
    
    // Grab current App User key to identify cart owner.
    switch(listingsStatus) {
        case LISTINGS_STATUS.myClaimedListings:     claimedByAppUserKey = sessionData.appUserKey;    break;
        case LISTINGS_STATUS.myDonatedListings:     donatedByAppUserKey = sessionData.appUserKey;    break;
        default:                                    throw new Error('Incorrect Listings Status: ' + listingsStatus);
    }

    handleGetFoodListings(getCartFoodListingsRequest, response, claimedByAppUserKey, donatedByAppUserKey);
}


function handleGetFoodListings(getFoodListingsRequest: GetFoodListingsRequest,
                               response: Response, claimedByAppUserKey?: number, donatedByAppUserKey?: number): void
{
    response.setHeader('Content-Type', 'application/json');

    getFoodListings(getFoodListingsRequest.filters, donatedByAppUserKey, claimedByAppUserKey)
        .then((foodListings: FoodListing[]) => {
            response.send(new GetFoodListingsResponse(foodListings, true, 'Food Listings Successfully Retrieved'));
        })
        .catch((err: Error) => {
            response.send(new GetFoodListingsResponse(null, false, err.message));
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
