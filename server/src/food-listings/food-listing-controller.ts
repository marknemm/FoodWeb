import { NextFunction, Request, Response } from 'express';
import { addFoodListing } from './add-food-listing';
import { getFoodListing } from './get-food-listings';
import { getFoodTypes } from './get-food-types';
import { claimFoodListing } from './claim-food-listing';

import { AddFoodListingRequest, AddFoodListingResponse, FoodListingUpload } from '../../../shared/food-listings/add-food-listing-message'
import { GetFoodListingsRequest, GetFoodListingsResponse, FoodListing } from '../../../shared/food-listings/get-food-listings-message';
import { GetFoodTypesResponse } from '../../../shared/food-listings/get-food-types-message';
import { ClaimFoodListingRequest } from '../../../shared/food-listings/claim-food-listing-message';


export function handleAddFoodListingRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    
    let addFoodListingRequest: AddFoodListingRequest = request.body;
    // The currently logged in user must be the Donor.
    let donorAppUserKey: number = request.session['appUserInfo'].appUserKey;
    let promise = addFoodListing(addFoodListingRequest.foodListingUpload, donorAppUserKey);

    promise.then((foodListingKey: number) => {
        response.send(new AddFoodListingResponse(foodListingKey, true, 'Food Listing Added Successfully'));
    })
    .catch((err: Error) => {
        response.send(new AddFoodListingResponse(null, false, 'Food Listing Add Failed'));
    });
}

export function handleGetFoodListingsRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    let getFoodListingsRequest: GetFoodListingsRequest = request.body;
    let promise = getFoodListing(getFoodListingsRequest.filters, null, null);

    promise.then((foodListings: Array<FoodListing>) => {
        response.send(new GetFoodListingsResponse(foodListings, true, 'Food Listings Successfully Retrieved'));
    })
    .catch((err: Error) => {
        response.send(new GetFoodListingsResponse(null, false, err.message));
    });
}

export function handleClaimFoodListingRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    let claimFoodListingRequest: ClaimFoodListingRequest = request.body;
    let claimedByAppUserKey: number = request.session['appUserInfo'].appUserKey;
    let promise = claimFoodListing(claimFoodListingRequest.foodListingKey, claimedByAppUserKey);

    promise.then(() => {
        response.send({ success: true, message: "FoodListing has been successfully claimed" });
    })
    .catch((err: Error) => {
        response.send();
    });
}

export function handleGetFoodTypes(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    let promise = getFoodTypes();

    promise.then((foodTypes: Array<string>) => {
        response.send(new GetFoodTypesResponse(foodTypes, true, 'Food Types Successfully Retrieved'));
    })
    .catch((err: Error) => {
        response.send(new GetFoodTypesResponse(null, false, err.message));
    });
}
