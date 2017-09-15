"use strict";
exports.__esModule = true;
/**
 * The expected request for the (un)claim food listings operation. Should be sent from the client to the server.
 */
var ClaimFoodListingRequest = /** @class */ (function () {
    function ClaimFoodListingRequest(
        /**
         * The key identifier of the Food Listing to be claimed.
         */
        foodListingKey) {
        this.foodListingKey = foodListingKey;
    }
    return ClaimFoodListingRequest;
}());
exports.ClaimFoodListingRequest = ClaimFoodListingRequest;
