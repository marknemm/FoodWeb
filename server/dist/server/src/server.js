'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var session = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
// Set global root directory variable and configure .env path.
global['rootDir'] = __dirname + '/../../../../';
require('dotenv').config({ path: global['rootDir'] + '.env' });
// Our controllers that will handle requests after this router hands off the data to them.
var authentication_controller_1 = require("./authentication/authentication-controller");
var food_listing_controller_1 = require("./food-listings/food-listing-controller");
// This is where compiled client ts files will go. We need this to locate index.html!
var clientBuildDir = global['rootDir'] + 'client/dist/';
var publicDir = global['rootDir'] + 'public';
var app = express();
// Some configuration settings for our App.
app.use(bodyParser.json());
app.use(express.static(clientBuildDir));
app.use(express.static(publicDir));
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 2000000 },
    resave: false,
    saveUninitialized: false
}));
app.set('port', (process.env.PORT || 5000));
module.exports = app;
// Handle /authentication/login route by passing off to AuthenticationController.
app.post('/authentication/login', authentication_controller_1.handleLoginRequest);
// Handle /authentication/logout route by passing it off to AuthenticationController.
app.get('/authentication/logout', authentication_controller_1.handleLogoutRequest);
// Handle /authentication/reAuthenticate route by passing off to AuthenticationController.
app.get('/authentication/reAuthenticate', authentication_controller_1.handleReAuthenticateRequest);
// Handle /authentication/signup route by passing it off to AuthenticationController.
app.post('/authentication/signup', authentication_controller_1.handleSignupRequest);
// Handle /authentication/updateAppUser route by passing it off to the AuthenticationController.
app.post('/authentication/updateAppUser', authentication_controller_1.handleUpdateAppUserRequest);
//Handle /authentication/verify route by passing it off to AuthenticationController.
app.get('/authentication/verify', authentication_controller_1.handleSignupVerification);
// Handle /foodListings/addFoodListing route by passing off to FoodListingController.
app.post('/foodListings/addFoodListing', food_listing_controller_1.handleAddFoodListing);
// Handle /foodListings/removeFoodListing route by passing off to FoodListingController.
app.post('/foodListings/removeFoodListing', food_listing_controller_1.handleRemoveFoodListing);
// Handle /foodListings/getFoodListings route by passing off to FoodListingController.
app.post('/foodListings/getFoodListings', food_listing_controller_1.handleGetFoodListings);
// Handle /foodListings/claimFoodListing route by passing off to FoodListingController.
app.post('/foodListings/claimFoodListing', food_listing_controller_1.handleClaimFoodListing);
// Handle /foodListings/unclaimFoodListing route by passing off to FoodListingController.
app.post('/foodListings/unclaimFoodListing', food_listing_controller_1.handleUnclaimFoodListing);
// Handle /foodListings/getFoodTypes route by passing off to FoodListingController.
app.get('/foodListings/getFoodTypes', food_listing_controller_1.handleGetFoodTypes);
app.get('/public/*', function (request, response) {
    response.sendFile(path.resolve(global['rootDir'] + request.url));
});
app.get('*', function (request, response) {
    response.sendFile(path.join(clientBuildDir + '/index.html'));
});
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
//# sourceMappingURL=server.js.map