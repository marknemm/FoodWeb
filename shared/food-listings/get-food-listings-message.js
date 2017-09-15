"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var food_listings_filters_1 = require("../food-listings/food-listings-filters");
exports.FoodListingsFilters = food_listings_filters_1.FoodListingsFilters;
var food_web_response_1 = require("../message-protocol/food-web-response");
var food_listing_1 = require("../food-listings/food-listing");
exports.FoodListing = food_listing_1.FoodListing;
/**
 * The expected request for the get food listings operation. Should be sent from the client to the server.
 */
var GetFoodListingsRequest = /** @class */ (function () {
    function GetFoodListingsRequest(
        /**
         * Filters to use when getting food listings.
         */
        filters) {
        this.filters = filters;
    }
    return GetFoodListingsRequest;
}());
exports.GetFoodListingsRequest = GetFoodListingsRequest;
/**
 * The expected response from the get food listings operation. Should be sent form the server to the client.
 */
var GetFoodListingsResponse = /** @class */ (function (_super) {
    __extends(GetFoodListingsResponse, _super);
    function GetFoodListingsResponse(
        /**
         * The food listings that were retrieved during the server operation.
         */
        foodListings, 
        /**
         * Indicates whether or not the operation on the back end was successful.
         */
        success, 
        /**
         * A message containing information pertaining to what happened during processing on the back end. If successful, then it should
         * contain a simple success message. If unsuccessful, then it should contain the error message (without leaking sensitive data).
         */
        message, 
        /**
         * Indicates if there is a need for the user to login to perform the related operation on the server.
         */
        loginRequired, 
        /**
         * Indicates if there is a need for the user to have their signup confirmed before performing certain functionality.
         */
        signupConfirmRequired) {
        if (loginRequired === void 0) { loginRequired = false; }
        if (signupConfirmRequired === void 0) { signupConfirmRequired = false; }
        var _this = _super.call(this, success, message, loginRequired, signupConfirmRequired) || this;
        _this.foodListings = foodListings;
        _this.success = success;
        _this.message = message;
        _this.loginRequired = loginRequired;
        _this.signupConfirmRequired = signupConfirmRequired;
        return _this;
    }
    return GetFoodListingsResponse;
}(food_web_response_1.FoodWebResponse));
exports.GetFoodListingsResponse = GetFoodListingsResponse;
