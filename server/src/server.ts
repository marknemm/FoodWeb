'use strict';
let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');
const path = require('path');


// Set global root directory variable and configure .env path.
global['rootDir'] = __dirname + '/../../../../';
require('dotenv').config({ path: global['rootDir'] + '.env' });


// Our session middleware and controllers that will handle requests after this router hands off the data to them.
import { Application } from 'express';
import { SessionData } from "./common-util/session-data";
import { handleLoginRequest,
         handleLogoutRequest,
         handleReAuthenticateRequest,
         handleSignupRequest,
         handleUpdateAppUserRequest,
         handleSignupVerification,
         handlePasswordRecovery,
         handlePasswordReset } from './authentication/authentication-controller';
import { handleAddFoodListing,
         handleRemoveFoodListing,
         handleGetFoodListings,
         handleGetDeliveryFoodListings,
         handleClaimFoodListing,
         handleUnclaimFoodListing,
         handleGetFoodTypes } from './food-listings/food-listing-controller';


// Configure paths to client JS files and public resource files (such as images).
const clientBuildDir: string = global['rootDir'] + 'client/dist/';
const publicDir: string = global['rootDir'] + 'public';


// Initialize & Configure Express App (Establish App-Wide Middleware).
let app: Application = express();
app.use(bodyParser.json( { limit: '500KB' } ));
app.use(express.static(clientBuildDir));
app.use(express.static(publicDir));
SessionData.sessionBootstrap(app);
app.set('port', (process.env.PORT || 5000));
module.exports = app; // Make available for mocha testing suites.


// Authentication Controller Routes.
app.post('/authentication/login',                   handleLoginRequest);
app.get( '/authentication/logout',                  handleLogoutRequest);
app.get( '/authentication/reAuthenticate',          handleReAuthenticateRequest);
app.post('/authentication/signup',                  handleSignupRequest);
app.get( '/authentication/verify',                  handleSignupVerification);
app.post('/authentication/recoverPassword',         handlePasswordRecovery);
app.post('/authentication/resetPassword',           handlePasswordReset);
app.post('/authentication/updateAppUser',           SessionData.ensureSessionActive, handleUpdateAppUserRequest);


// Food Listing Controller Routes.
app.post('/foodListings/addFoodListing',            SessionData.ensureSessionActive, handleAddFoodListing);
app.post('/foodListings/removeFoodListing',         SessionData.ensureSessionActive, handleRemoveFoodListing);
app.post('/foodListings/getFoodListings',           SessionData.ensureSessionActive, handleGetFoodListings);
app.post('/foodListings/getDeliveryFoodListings',   SessionData.ensureSessionActive, handleGetDeliveryFoodListings);
app.post('/foodListings/claimFoodListing',          SessionData.ensureSessionActive, handleClaimFoodListing);
app.post('/foodListings/unclaimFoodListing',        SessionData.ensureSessionActive, handleUnclaimFoodListing);
app.get( '/foodListings/getFoodTypes',              handleGetFoodTypes);


// Public Resource Route Handler (for local image hosting).
app.get('/public/*', function(request, response) {
    response.sendFile(path.resolve(global['rootDir'] + request.url));
});


// All Remaining Routes Handler (for serving our main web page).
app.get('*', function (request, response) {
    response.sendFile(path.join(clientBuildDir + '/index.html'));
});


// Log Message That Says When App is Up & Running.
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
