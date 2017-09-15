"use strict";
exports.__esModule = true;
/**
 * A single Food Listing entry that mainly contains data that is relavent to the user when browsing food listings.
 */
var FoodListing = /** @class */ (function () {
    function FoodListing(foodListingKey, donorOrganizationName, donorOrganizationAddress, donorOrganizationCity, donorOrganizationState, donorOrganizationZip, donorLastName, donorFirstName, 
        /**
         * The distance of the donor from the receiver that is browsing the food listings.
         */
        donorDistance, foodTypes, foodDescription, quantityClass, perishable, 
        /**
         * Expiration date of the format mm/dd/yyyy
         */
        expirationDate, 
        /**
         * The url of a saved Food Listing that will be used to display the associated image.
         */
        imgUrl) {
        this.foodListingKey = foodListingKey;
        this.donorOrganizationName = donorOrganizationName;
        this.donorOrganizationAddress = donorOrganizationAddress;
        this.donorOrganizationCity = donorOrganizationCity;
        this.donorOrganizationState = donorOrganizationState;
        this.donorOrganizationZip = donorOrganizationZip;
        this.donorLastName = donorLastName;
        this.donorFirstName = donorFirstName;
        this.donorDistance = donorDistance;
        this.foodTypes = foodTypes;
        this.foodDescription = foodDescription;
        this.quantityClass = quantityClass;
        this.perishable = perishable;
        this.expirationDate = expirationDate;
        this.imgUrl = imgUrl;
    }
    return FoodListing;
}());
exports.FoodListing = FoodListing;
