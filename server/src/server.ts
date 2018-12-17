import express = require('express');
import bodyParser = require('body-parser');
import multer = require('multer');
import path = require('path');
import dotenv = require('dotenv');
import 'reflect-metadata';

// Set important paths in global.
const PRODUCTION: boolean = (process.env['PRODUCTION']  === 'true');
const QA: boolean = (process.env['QA'] === 'true');
global['rootDir'] = (PRODUCTION || QA) ?
  path.join(__dirname, '..', '..', '..', '..') :
  path.join(__dirname, '..', '..');
global['serverDir'] = path.join(global['rootDir'], 'server');
global['clientDir'] = path.join(global['rootDir'], 'client');
global['clientBuildDir'] = path.join(global['clientDir'], 'dist');
global['assetsDir'] = path.join(global['clientBuildDir'], 'assets');
global['clientEmailDir'] = path.join(global['clientDir'], 'email');
global['publicDir'] = path.join(global['rootDir'], 'public');

// Load .env into process (pre-set environment variables on machine take precedence).
if (!PRODUCTION && !QA) {
  const envPath: string = path.join(global['serverDir'], '.env');
  dotenv.config({ path: envPath });
  if (!process.env.SERVER_PORT) {
    throw new Error(`Incorrect path to .env config file: ${envPath}`);
  }
}

// Our session middleware and controllers that will handle requests after this router hands off the data to them.
import { Application } from 'express';
import { SessionData } from './common-util/session-data';
import { deserialize } from './deserialization/deserialization';
import { logRequest, logResponse } from './logging/request-response-logger';
import { logger } from './logging/logger';
import {
  handleLoginRequest,
  handleLogoutRequest,
  handleReAuthenticateRequest,
  handleSignupRequest,
  handleUpdateAppUserRequest,
  handleSignupVerification,
  handlePasswordRecovery,
} from './app-user/app-user-controller';
import {
  handleGetFoodListings,
  handleGetFoodListingFilters,
} from './common-user/common-user-controller';
import {
  handleAddFoodListing,
  handleRemoveFoodListing,
} from './donor/donor-controller';
import {
  handleClaimFoodListing,
  handleUnclaimFoodListing,
} from './receiver/receiver-controller';
import {
  handleScheduleDelivery,
  handleCancelDelivery,
  handleUpdateDeliveryState,
} from './deliverer/deliverer-controller';
import { handleLogClientData } from './logging/client-data-logger';
import { bootstrapDatabase } from './database-util/database-bootstrap/database-bootstrap';
import { scheduleJobs } from './cron/cron-schedule';

// Initialize & Configure Express App (Establish App-Wide Middleware).
const app: Application = express();
app.use(bodyParser.json({ limit: '500KB' })); // Need larger size to support cropped images (maybe change this in future to just use image bounds and media attachment).
app.use(express.static(global['clientBuildDir']));
app.use(express.static(global['publicDir']));
SessionData.sessionBootstrap(app);
app.use(multer().any());
app.use(deserialize);   // Automatically perform Custom Deserialization of all incomming data.
app.use(logRequest);    // Log all express requests.
app.use(logResponse);   // Log all express responses.
app.set('port', (process.env.PORT || process.env.SERVER_PORT || 5000));
module.exports = app; // Make available for mocha testing suites.

// app-user Controller Routes.
app.post('/appUser/login', handleLoginRequest);
app.get('/appUser/logout', handleLogoutRequest);
app.get('/appUser/reAuthenticate', handleReAuthenticateRequest);
app.post('/appUser/signup', handleSignupRequest);
app.get('/appUser/verify', handleSignupVerification);
app.post('/appUser/recoverPassword', handlePasswordRecovery);
app.post('/appUser/updateAppUser', SessionData.ensureSessionActive, handleUpdateAppUserRequest);

// Common Donor-Receiver-Deliverer Controller Routes.
app.post('/commonUser/getFoodListings', SessionData.ensureSessionActive, handleGetFoodListings);
app.post('/commonUser/getFoodListingFilters', SessionData.ensureSessionActive, handleGetFoodListingFilters);

// Donor Controller Routes.
app.post('/donor/addFoodListing', SessionData.ensureSessionActive, handleAddFoodListing);
app.post('/donor/removeFoodListing', SessionData.ensureSessionActive, handleRemoveFoodListing);

// Receiver Controller Routes.
app.post('/receiver/claimFoodListing', SessionData.ensureSessionActive, handleClaimFoodListing);
app.post('/receiver/unclaimFoodListing', SessionData.ensureSessionActive, handleUnclaimFoodListing);

// Deliverer Controller Routes.
app.post('/deliverer/scheduleDelivery', SessionData.ensureSessionActive, handleScheduleDelivery);
app.post('/deliverer/cancelDelivery', SessionData.ensureSessionActive, handleCancelDelivery);
app.post('/deliverer/updateDeliveryState', SessionData.ensureSessionActive, handleUpdateDeliveryState);

// Logging Utility Routes.
app.post('/logging/logClientData', handleLogClientData);

// Public Resource Route Handler (for local image hosting).
app.get('/public/*', (request, response) => {
  response.sendFile(path.resolve(global['rootDir'] + decodeURI(request.url)));
});

// Food Web's Main Asset Files Such as Icon and Banner Images.
app.get('/assets/*', (request, response) => {
  const assetFile: string = request.url.split('/assets/')[1];
  response.sendFile(path.resolve(global['assetsDir'], assetFile));
});

// All Remaining Routes Handler (for serving our main web page).
app.get('*', (request, response) => {
  response.sendFile(path.join(global['clientBuildDir'], 'index.html'));
});

// Do any database initialization that is necessary before we start servicing requests.
bootstrapDatabase().then(() => {
  // Schedule all cron type jobs.
  scheduleJobs();

  app.listen(app.get('port'), () => {
    // Log Message That Says When App is Up & Running.
    logger.info('Node app is running on port', app.get('port'));
  });
});
