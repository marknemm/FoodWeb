"use strict";
exports.__esModule = true;
/**
 * A container for holding data used in the upload of a new food listing.
 */
var FoodListingUpload = /** @class */ (function () {
    function FoodListingUpload(foodListingKey, foodTypes, foodDescription, perishable, 
        /**
         * Expiration date of the format mm/dd/yyyy
         */
        expirationDate, 
        /**
         * The string representation of the image associated with the listing.
         * Should only be populated for the addition or upload of a new Food Listing.
         */
        imageUpload) {
        this.foodListingKey = foodListingKey;
        this.foodTypes = foodTypes;
        this.foodDescription = foodDescription;
        this.perishable = perishable;
        this.expirationDate = expirationDate;
        this.imageUpload = imageUpload;
    }
    return FoodListingUpload;
}());
exports.FoodListingUpload = FoodListingUpload;
