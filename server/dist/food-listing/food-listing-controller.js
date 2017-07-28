"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var add_food_listing_1 = require("./add-food-listing");
var get_food_listings_1 = require("./get-food-listings");
var food_listing_1 = require("./food-listing");
function handleAddFoodListingRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var foodListing = new food_listing_1.FoodListing(request.session['appUserKey'], request.body.foodType, request.body.perishable, request.body.foodDescription, request.body.expirationDate, request.body.image, null // The model will generate the image name and fill this for now!
    );
    var promise = add_food_listing_1.addFoodListing(foodListing);
    promise.then(function () {
        response.send({ success: true, message: 'Food listing added successfully' });
    })
        .catch(function () {
        response.send({ success: false, message: 'Error: food listing add failed' });
    });
}
exports.handleAddFoodListingRequest = handleAddFoodListingRequest;
function handleGetFoodListingsRequest(request, response) {
    response.setHeader('Content-Type', 'application/json');
    var promise = get_food_listings_1.getFoodListing(request.body);
    promise.then(function (searchResult) {
        response.send(JSON.stringify(searchResult));
    })
        .catch(function (err) {
        response.send(JSON.stringify([]));
    });
}
exports.handleGetFoodListingsRequest = handleGetFoodListingsRequest;
//# sourceMappingURL=C:/Users/User Name/ConnectFood/server/dist/food-listing/food-listing-controller.js.map