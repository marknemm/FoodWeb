import { NextFunction, Request, Response } from 'express';

import { SessionData } from "../authentication/session-data";
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


export function handleGetFoodListings(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    let getFoodListingsRequest: GetFoodListingsRequest = request.body;
    let claimedByAppUserKey: number = null;
    let donatedByAppUserKey: number = null;
    let sessionData: SessionData = request.session['sessionData'];

    // Grab session App User Key for claimed by and donated by filters if necessary.
    switch(getFoodListingsRequest.filters.listingsStatus) {
        case LISTINGS_STATUS.myClaimedListings:     claimedByAppUserKey = sessionData.appUserKey;    break;
        case LISTINGS_STATUS.myDonatedListings:     donatedByAppUserKey = sessionData.appUserKey;    break;
    }

    let promise: Promise<Array<FoodListing>> = getFoodListings(getFoodListingsRequest.filters, donatedByAppUserKey, claimedByAppUserKey);
    promise.then((foodListings: Array<FoodListing>) => {
        response.send(new GetFoodListingsResponse(foodListings, true, 'Food Listings Successfully Retrieved'));
    })
    .catch((err: Error) => {
        response.send(new GetFoodListingsResponse(null, false, err.message));
    });
}


export function handleAddFoodListing(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    
    let addFoodListingRequest: AddFoodListingRequest = request.body;
    let sessionData: SessionData = request.session['sessionData'];
    // The currently logged in user must be the Donor.
    let donorAppUserKey: number = sessionData.appUserKey;

    let promise: Promise<number> = addFoodListing(addFoodListingRequest.foodListingUpload, donorAppUserKey);
    promise.then((foodListingKey: number) => {
        response.send(new AddFoodListingResponse(foodListingKey, true, 'Food Listing Added Successfully'));
    })
    .catch((err: Error) => {
        response.send(new AddFoodListingResponse(null, false, 'Food Listing Add Failed'));
    });
}


export function handleRemoveFoodListing(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    let removeFoodListingRequest: ClaimFoodListingRequest = request.body;
    let sessionData: SessionData = request.session['sessionData'];
    let addedByAppUserKey: number = sessionData.appUserKey;

    let promise: Promise<void> = removeFoodListing(removeFoodListingRequest.foodListingKey, addedByAppUserKey);
    promise.then(() => {
        response.send(new FoodWebResponse(true, 'Food listing has been successfully removed.'));
    })
    .catch((err: Error) => {
        response.send(new FoodWebResponse(false, err.message));
    });
}


export function handleClaimFoodListing(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    let claimFoodListingRequest: ClaimFoodListingRequest = request.body;
    let sessionData: SessionData = request.session['sessionData'];
    let claimedByAppUserKey: number = sessionData.appUserKey;

    let promise: Promise<void> = claimFoodListing(claimFoodListingRequest.foodListingKey, claimedByAppUserKey);
    promise.then(() => {
        response.send(new FoodWebResponse(true, 'Food listing has been successfully claimed.'));
    })
    .catch((err: Error) => {
        response.send(new FoodWebResponse(false, err.message));
    });
}


export function handleUnclaimFoodListing(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    let unclaimFoodListingRequest: ClaimFoodListingRequest = request.body;
    let sessionData: SessionData = request.session['sessionData'];
    let claimedByAppUserKey: number = sessionData.appUserKey;

    let promise: Promise<void> = unclaimFoodListing(unclaimFoodListingRequest.foodListingKey, claimedByAppUserKey);
    promise.then(() => {
        response.send(new FoodWebResponse(true, 'Food listing has been successfully unclaimed.'));
    })
    .catch((err: Error) => {
        response.send(new FoodWebResponse(false, err.message));
    });
}


export function handleGetFoodTypes(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    getFoodTypes().then((foodTypes: Array<string>) => {
        response.send(new GetFoodTypesResponse(foodTypes, true, 'Food types successfully retrieved.'));
    })
    .catch((err: Error) => {
        response.send(new GetFoodTypesResponse(null, false, err.message));
    });
}
