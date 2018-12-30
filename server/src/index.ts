import express = require('express');
import bodyParser = require('body-parser');
import multer = require('multer');
import path = require('path');
import dotenv = require('dotenv');
import 'reflect-metadata';
import { Request, Response } from 'express';

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

// Initialize & Configure Express App (Establish App-Wide Middleware).
const app: Application = express();
app.use(bodyParser.json({ limit: '500KB' })); // Need larger size to support cropped images (maybe change this in future to just use image bounds and media attachment).
app.use(express.static(global['clientBuildDir']));
app.use(express.static(global['publicDir']));
// SessionData.sessionBootstrap(app);
app.use(multer().any());
app.set('port', (process.env.PORT || process.env.SERVER_PORT || 5000));
module.exports = app; // Make available for mocha testing suites.

app.use('/session');

// Public Resource Route Handler (for local image hosting).
app.get('/public/*', (request: Request, response: Response) => {
  response.sendFile(path.resolve(global['rootDir'] + decodeURI(request.url)));
});

// Food Web's Main Asset Files Such as Icon and Banner Images.
app.get('/assets/*', (request: Request, response: Response) => {
  const assetFile: string = request.url.split('/assets/')[1];
  response.sendFile(path.resolve(global['assetsDir'], assetFile));
});

// All Remaining Routes Handler (for serving our main web page).
app.get('*', (request: Request, response: Response) => {
  response.sendFile(path.join(global['clientBuildDir'], 'index.html'));
});

app.listen(app.get('port'), () => {
  // Log Message That Says When App is Up & Running.
  console.log(`Node app is running on port: ${app.get('port')}`);
});
