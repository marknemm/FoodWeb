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
// Our session middleware and controllers that will handle requests after this router hands off the data to them.
var session_data_1 = require("./common-util/session-data");
var authentication_controller_1 = require("./authentication/authentication-controller");
var food_listing_controller_1 = require("./food-listings/food-listing-controller");
// Configure paths to client JS files and public resource files (such as images).
var clientBuildDir = global['rootDir'] + 'client/dist/';
var publicDir = global['rootDir'] + 'public';
// Initialize & Configure Express App (Establish App-Wide Middleware).
var app = express();
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
module.exports = app; // Make available for mocha testing suites.
// Authentication Controller Routes.
app.post('/authentication/login', authentication_controller_1.handleLoginRequest);
app.get('/authentication/logout', authentication_controller_1.handleLogoutRequest);
app.get('/authentication/reAuthenticate', authentication_controller_1.handleReAuthenticateRequest);
app.post('/authentication/signup', authentication_controller_1.handleSignupRequest);
app.get('/authentication/verify', authentication_controller_1.handleSignupVerification);
app.post('/authentication/updateAppUser', session_data_1.SessionData.ensureSessionActive, authentication_controller_1.handleUpdateAppUserRequest);
// Food Listing Controller Routes.
app.post('/foodListings/addFoodListing', session_data_1.SessionData.ensureSessionActive, food_listing_controller_1.handleAddFoodListing);
app.post('/foodListings/removeFoodListing', session_data_1.SessionData.ensureSessionActive, food_listing_controller_1.handleRemoveFoodListing);
app.post('/foodListings/getReceiverFoodListings', food_listing_controller_1.handleGetReceiverFoodListings);
app.post('/foodListings/getCartFoodListings', session_data_1.SessionData.ensureSessionActive, food_listing_controller_1.handleGetCartFoodListings);
app.post('/foodListings/claimFoodListing', session_data_1.SessionData.ensureSessionActive, food_listing_controller_1.handleClaimFoodListing);
app.post('/foodListings/unclaimFoodListing', session_data_1.SessionData.ensureSessionActive, food_listing_controller_1.handleUnclaimFoodListing);
app.get('/foodListings/getFoodTypes', food_listing_controller_1.handleGetFoodTypes);
// Public Resource Route Handler (for local image hosting).
app.get('/public/*', function (request, response) {
    response.sendFile(path.resolve(global['rootDir'] + request.url));
});
// All Remaining Routes Handler (for serving our main web page).
app.get('*', function (request, response) {
    response.sendFile(path.join(clientBuildDir + '/index.html'));
});
// Log Message That Says When App is Up & Running.
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
//# sourceMappingURL=server.js.map