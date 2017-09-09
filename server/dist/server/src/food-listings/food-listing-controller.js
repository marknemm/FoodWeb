"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var add_food_listing_1 = require("./add-food-listing");
var remove_food_listing_1 = require("./remove-food-listing");
var get_food_listings_1 = require("./get-food-listings");
var get_food_types_1 = require("./get-food-types");
var claim_food_listing_1 = require("./claim-food-listing");
var add_food_listing_message_1 = require("../../../shared/food-listings/add-food-listing-message");
var get_food_listings_message_1 = require("../../../shared/food-listings/get-food-listings-message");
var get_food_types_message_1 = require("../../../shared/food-listings/get-food-types-message");
var food_listings_filters_1 = require("../../../shared/food-listings/food-listings-filters");
var food_web_response_1 = require("../../../shared/message-protocol/food-web-response");
function handleGetFoodListings(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var getFoodListingsRequest = request.body;
    var claimedByAppUserKey = null;
    var donatedByAppUserKey = null;
    var sessionData = request.session['sessionData'];
    // Grab session App User Key for claimed by and donated by filters if necessary.
    switch (getFoodListingsRequest.filters.listingsStatus) {
        case food_listings_filters_1.LISTINGS_STATUS.myClaimedListings:
            claimedByAppUserKey = sessionData.appUserKey;
            break;
        case food_listings_filters_1.LISTINGS_STATUS.myDonatedListings:
            donatedByAppUserKey = sessionData.appUserKey;
            break;
    }
    var promise = get_food_listings_1.getFoodListings(getFoodListingsRequest.filters, donatedByAppUserKey, claimedByAppUserKey);
    promise.then(function (foodListings) {
        response.send(new get_food_listings_message_1.GetFoodListingsResponse(foodListings, true, 'Food Listings Successfully Retrieved'));
    })
        .catch(function (err) {
        response.send(new get_food_listings_message_1.GetFoodListingsResponse(null, false, err.message));
    });
}
exports.handleGetFoodListings = handleGetFoodListings;
function handleAddFoodListing(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var addFoodListingRequest = request.body;
    var sessionData = request.session['sessionData'];
    // The currently logged in user must be the Donor.
    var donorAppUserKey = sessionData.appUserKey;
    var promise = add_food_listing_1.addFoodListing(addFoodListingRequest.foodListingUpload, donorAppUserKey);
    promise.then(function (foodListingKey) {
        response.send(new add_food_listing_message_1.AddFoodListingResponse(foodListingKey, true, 'Food Listing Added Successfully'));
    })
        .catch(function (err) {
        response.send(new add_food_listing_message_1.AddFoodListingResponse(null, false, 'Food Listing Add Failed'));
    });
}
exports.handleAddFoodListing = handleAddFoodListing;
function handleRemoveFoodListing(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var removeFoodListingRequest = request.body;
    var sessionData = request.session['sessionData'];
    var addedByAppUserKey = sessionData.appUserKey;
    var promise = remove_food_listing_1.removeFoodListing(removeFoodListingRequest.foodListingKey, addedByAppUserKey);
    promise.then(function () {
        response.send(new food_web_response_1.FoodWebResponse(true, 'Food listing has been successfully removed.'));
    })
        .catch(function (err) {
        response.send(new food_web_response_1.FoodWebResponse(false, err.message));
    });
}
exports.handleRemoveFoodListing = handleRemoveFoodListing;
function handleClaimFoodListing(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var claimFoodListingRequest = request.body;
    var sessionData = request.session['sessionData'];
    var claimedByAppUserKey = sessionData.appUserKey;
    var promise = claim_food_listing_1.claimFoodListing(claimFoodListingRequest.foodListingKey, claimedByAppUserKey);
    promise.then(function () {
        response.send(new food_web_response_1.FoodWebResponse(true, 'Food listing has been successfully claimed.'));
    })
        .catch(function (err) {
        response.send(new food_web_response_1.FoodWebResponse(false, err.message));
    });
}
exports.handleClaimFoodListing = handleClaimFoodListing;
function handleUnclaimFoodListing(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var unclaimFoodListingRequest = request.body;
    var sessionData = request.session['sessionData'];
    var claimedByAppUserKey = sessionData.appUserKey;
    var promise = claim_food_listing_1.unclaimFoodListing(unclaimFoodListingRequest.foodListingKey, claimedByAppUserKey);
    promise.then(function () {
        response.send(new food_web_response_1.FoodWebResponse(true, 'Food listing has been successfully unclaimed.'));
    })
        .catch(function (err) {
        response.send(new food_web_response_1.FoodWebResponse(false, err.message));
    });
}
exports.handleUnclaimFoodListing = handleUnclaimFoodListing;
function handleGetFoodTypes(request, response) {
    response.setHeader('Content-Type', 'application/json');
    get_food_types_1.getFoodTypes().then(function (foodTypes) {
        response.send(new get_food_types_message_1.GetFoodTypesResponse(foodTypes, true, 'Food types successfully retrieved.'));
    })
        .catch(function (err) {
        response.send(new get_food_types_message_1.GetFoodTypesResponse(null, false, err.message));
    });
}
exports.handleGetFoodTypes = handleGetFoodTypes;
//# sourceMappingURL=food-listing-controller.js.map