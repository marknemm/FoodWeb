"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var food_listings_filters_1 = require("../food-listings/food-listings-filters");
exports.FoodListingsFilters = food_listings_filters_1.FoodListingsFilters;
/**
 * Defines a common data type that should be sent from the client and received by the server for a get food listings request.
 */
var GetFoodListingsRequest = (function () {
    function GetFoodListingsRequest(
        /**
         * The (search) filters used when getting a segment of food listings from the server.
         */
        filters) {
        this.filters = filters;
    }
    return GetFoodListingsRequest;
}());
exports.GetFoodListingsRequest = GetFoodListingsRequest;
//# sourceMappingURL=get-food-listings-request.js.map