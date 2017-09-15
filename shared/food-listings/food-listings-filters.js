"use strict";
exports.__esModule = true;
/**
 * An emumeration of different food listing statuses to filter on.
 */
var LISTINGS_STATUS;
(function (LISTINGS_STATUS) {
    LISTINGS_STATUS[LISTINGS_STATUS["unclaimedListings"] = 0] = "unclaimedListings";
    LISTINGS_STATUS[LISTINGS_STATUS["myClaimedListings"] = 1] = "myClaimedListings";
    LISTINGS_STATUS[LISTINGS_STATUS["myDonatedListings"] = 2] = "myDonatedListings";
})(LISTINGS_STATUS = exports.LISTINGS_STATUS || (exports.LISTINGS_STATUS = {}));
;
/**
 * A basic container for Food Listing filter data that may be sent to/from the server/client.
 */
var FoodListingsFilters = /** @class */ (function () {
    function FoodListingsFilters(
        /**
         * Determines what food types the results should contain.
         */
        foodTypes, 
        /**
         * Determines if results should include perishable elements.
         */
        perishable, 
        /**
         * Determines if results should include non-perishable elements.
         */
        notPerishable, 
        /**
         * Determines the minimum date that retrieved items may expire after.
         */
        earliestExpireDate, 
        /**
         * Determines the maximum distance from the requesting entity that donations must fall within.
         */
        maxDistance, 
        /**
         * Determines the offset used when retrieving a limited segment of food listings.
         */
        retrievalOffset, 
        /**
         * Determines the number of food listings that will be contained in the limited segment of retrievals.
         */
        retrievalAmount, 
        /**
         * Determines what food listings we should bring back based off of their status (unclaimed, claimed, or donated relative to the current user).
         */
        listingsStatus) {
        if (listingsStatus === void 0) { listingsStatus = LISTINGS_STATUS.unclaimedListings; }
        this.foodTypes = foodTypes;
        this.perishable = perishable;
        this.notPerishable = notPerishable;
        this.earliestExpireDate = earliestExpireDate;
        this.maxDistance = maxDistance;
        this.retrievalOffset = retrievalOffset;
        this.retrievalAmount = retrievalAmount;
        this.listingsStatus = listingsStatus;
    }
    return FoodListingsFilters;
}());
exports.FoodListingsFilters = FoodListingsFilters;
