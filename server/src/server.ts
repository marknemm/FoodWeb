'use strict';
var express = require('express');
var session = require('express-session');
var pg = require('pg');
var http = require('http');
var bodyParser = require('body-parser');
const path = require('path');


var connectionPool = require('./database_help/connection_pool');

// Our controllers that will handle requests after this router hands off the data to them.
import { AuthenticationController } from './authentication/authentication_controller';
import { AuthenticationModel} from './authentication/authentication_model';
import { DonorController } from './donor/donor_controller';
import { ReceiverController } from './receiver/receiver_controller';

// This is where compiled client ts files will go. We need this to locate index.html!
const clientBuildDir = __dirname + '/../../client/dist/';

var app = express();
// Some configuration settings for our App.
app.use(bodyParser.json());
app.use(express.static(clientBuildDir));
app.use(session({ 
  secret: 'xefbwefiefw',
  cookie: { maxAge: 60000 }, // 1 hour.
  resave: false,
  saveUninitialized: false
}));
app.set('port', (process.env.PORT || 5000));
module.exports = app;

// Make sure that we can locate our environmental variable (.env) file!
require('dotenv').config({path: __dirname + '/../../.env'});

// Initialize our Controller objects. These are used to actually handle routes defined in this file.
var authenticationController : AuthenticationController = new AuthenticationController();
var authenticationModel : AuthenticationModel = new AuthenticationModel();
var donorController : DonorController = new DonorController();
var receeverController : ReceiverController = new ReceiverController();

app.get('/authentication/reAuthenticate', authenticationController.reAuthenticate.bind(authenticationController));

// Handle /authentication/login route by passing off to LoginController.
app.post('/authentication/login', authenticationController.login.bind(authenticationController));

//Handle /authentication/signup route by passing it off to SignupController
app.post('/authentication/signup', authenticationController.signup.bind(authenticationController));

//Handle /authentication/logout route by passing it off to LogoutController
app.get('/authentication/logout', authenticationController.logout.bind(authenticationController));

// Handle /donor/addFoodListing route by passing off to DonorController.
app.post('/donor/addFoodListing', donorController.addFoodListing.bind(donorController));

app.post('/receiver/getFoodListings', receeverController.getFoodListings.bind(receeverController));


app.get('*', function (request, response) {
    response.sendFile(path.join(clientBuildDir + '/index.html'));
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
