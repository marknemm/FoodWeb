import { NextFunction, Request, Response } from 'express';
import { addFoodListing } from './add-food-listing';
import { getFoodListing } from './get-food-listings';
import { getFoodTypes } from './get-food-types';
import { claimFoodListing } from './claim-food-listing';

import { AddFoodListingRequest, FoodListingUpload } from '../../../shared/food-listings/add-food-listing-message'
import { GetFoodListingsRequest, GetFoodListingsResponse, FoodListing } from '../../../shared/food-listings/get-food-listings-message';
import { GetFoodTypesResponse } from '../../../shared/food-listings/get-food-types-message';

export function handleAddFoodListingRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    
    let addFoodListingRequest: AddFoodListingRequest = request.body;
    let foodListingUpload: FoodListingUpload = addFoodListingRequest.foodListingUpload;
    foodListingUpload.donorAppUserKey = request.session['appUserInfo'].appUserKey;

    var promise = addFoodListing(foodListingUpload);
    promise.then(function () {
        response.send({ success: true, message: 'Food listing added successfully' });
    })
    .catch(handleErrorResponse.bind(this, response));
}

export function handleGetFoodListingsRequest(request: Request, response: Response): void {
    let getFoodListingsRequest: GetFoodListingsRequest = request.body;
    response.setHeader('Content-Type', 'application/json');

    let promise = getFoodListing(getFoodListingsRequest.filters, null, null);
    promise.then((foodListings: Array<FoodListing>) => {
        response.send(new GetFoodListingsResponse(foodListings, true, 'Food Listings Successfully Retrieved'));
    })
    .catch((err: Error) => {
        response.send(new GetFoodListingsResponse(null, false, err.message));
    });
}

/*export function handleReceiverCartGetFoodListingsRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    let requestedByAppUserKey: number = request.session.appUserKey;
    let organizationKey: number = request.session.receiverOrganizationKey;
    if (organizationKey == null) {
        response.send(new Error("Session has ended"));
    }
    else {
        var promise = getFoodListing(request.body, requestedByAppUserKey, organizationKey);
        promise.then((searchResult: Array<object>) => {
            response.send({ success: true, message: 'Food Listings successfully retrieved', searchResult: searchResult });
        })
        .catch(handleErrorResponse.bind(this, response));
    }
}*/

export function handleClaimFoodListingRequest(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');
    var promise = claimFoodListing(request.body);
    promise.then((claimResult: Boolean) => {
        response.send({ success: true, message: "FoodListing has been successfully claimed" });
    })
    .catch(handleErrorResponse.bind(this, response));
}


export function handleGetFoodTypes(request: Request, response: Response): void {
    response.setHeader('Content-Type', 'application/json');

    var promise = getFoodTypes();
    promise.then((foodTypes: Array<string>) => {
        response.send(new GetFoodTypesResponse(foodTypes, true, 'Food Types Successfully Retrieved'));
    })
    .catch((err: Error) => {
        response.send(new GetFoodTypesResponse(null, false, err.message));
    });
}

/**
 * Handles an error from the model and sends an appropriate response to the front end.
 * @param response The response that will be sent to the front end.
 * @param err The error from the model.
 */
function handleErrorResponse(response: Response, err: Error): void {
    response.send({ success: false, message: err.message });
}
