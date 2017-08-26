'use strict';
var express = require('express');
var session = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');
const path = require('path');

// Set global root directory variable and configure .env path.
global['rootDir'] = __dirname + '/../../../../';
require('dotenv').config({ path: global['rootDir'] + '.env' });

// Our controllers that will handle requests after this router hands off the data to them.
import { handleLoginRequest,
         handleLogoutRequest,
         handleReAuthenticateRequest,
         handleSignupRequest,
         handleSignupVerification } from './authentication/authentication-controller';
import { handleAddFoodListingRequest,
         handleGetFoodListingsRequest,
         handleClaimFoodListingRequest,
         handleGetFoodTypes } from './food-listings/food-listing-controller';

// This is where compiled client ts files will go. We need this to locate index.html!
const clientBuildDir = global['rootDir'] + 'client/dist/';
const publicDir = global['rootDir'] + 'public';

var app = express();
// Some configuration settings for our App.
app.use(bodyParser.json());
app.use(express.static(clientBuildDir));
app.use(express.static(publicDir));
app.use(session({ 
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 2000000 }, // Alot.
  resave: false,
  saveUninitialized: false
}));
app.set('port', (process.env.PORT || 5000));
module.exports = app;

// Handle /authentication/login route by passing off to AuthenticationController.
app.post('/authentication/login', handleLoginRequest);

//Handle /authentication/logout route by passing it off to AuthenticationController.
app.get('/authentication/logout', handleLogoutRequest);

// Handle /authentication/reAuthenticate route by passing off to AuthenticationController.
app.get('/authentication/reAuthenticate', handleReAuthenticateRequest);

//Handle /authentication/signup route by passing it off to AuthenticationController.
app.post('/authentication/signup', handleSignupRequest);

//Handle /authentication/verify route by passing it off to AuthenticationController.
app.get('/authentication/verify', handleSignupVerification);

// Handle /foodListings/addFoodListing route by passing off to FoodListingController.
app.post('/foodListings/addFoodListing', handleAddFoodListingRequest);

// Handle /foodListings/getFoodListings route by passing off to FoodListingController.
app.post('/foodListings/getFoodListings', handleGetFoodListingsRequest);

// Handle /foodListings/claimFoodListing route by passing off to FoodListingController.
app.post('/foodListings/claimFoodListing', handleClaimFoodListingRequest);

// Handle /foodListings/getFoodTypes route by passing off to FoodListingController.
app.get('/foodListings/getFoodTypes', handleGetFoodTypes);


app.get('/public/*', function(request, response) {
    response.sendFile(path.resolve(global['rootDir'] + request.url));
});


app.get('*', function (request, response) {
    response.sendFile(path.join(clientBuildDir + '/index.html'));
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
