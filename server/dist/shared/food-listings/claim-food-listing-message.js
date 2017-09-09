"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The expected request for the (un)claim food listings operation. Should be sent from the client to the server.
 */
var ClaimFoodListingRequest = (function () {
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
//# sourceMappingURL=claim-food-listing-message.js.map