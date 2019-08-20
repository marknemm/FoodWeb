import express = require('express');
import forceHttps = require('express-force-https');
import bodyParser = require('body-parser');
import multer = require('multer');
import path = require('path');
import dotenv = require('dotenv');
import 'reflect-metadata';
import { Request, Response } from 'express';
import { JSONDateReviver } from '../../shared/src/helpers/json-date-reviver';

// Set important paths in global.
const PRODUCTION: boolean = (process.env['PRODUCTION']  === 'true');
const QA: boolean = (process.env['QA'] === 'true');
global['rootDir'] = path.join(__dirname, '..', '..', '..', '..');
global['serverDir'] = path.join(global['rootDir'], 'server');
global['clientDir'] = path.join(global['rootDir'], 'client');
global['clientBuildDir'] = path.join(global['clientDir'], 'dist');
global['assetsDir'] = path.join(global['clientBuildDir'], 'assets');
global['clientEmailDir'] = path.join(global['clientDir'], 'email');
global['publicDir'] = path.join(global['rootDir'], 'public');
global['emailTemplatesDir'] = path.join(__dirname, '..', 'templates', 'email');

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
import { initDbConnectionPool } from './helpers/db-connection-pool';
import { initSSE } from './helpers/server-side-event';
import { expressSession } from './middlewares/session.middleware';
import { recaptcha } from './middlewares/recaptcha.middleware';

// Initialize & Configure Express App (Establish App-Wide Middleware).
const app: Application = express();
new JSONDateReviver().initJSONDateReviver();
app.use(forceHttps);
app.use(bodyParser.json({ limit: '500KB' })); // Need larger size to support cropped images (maybe change this in future to just use image bounds and media attachment).
app.use(multer().any());
app.use(expressSession);
app.use(recaptcha);
app.use(express.static(global['clientBuildDir']));
app.use(express.static(global['publicDir']));
app.set('port', (process.env.PORT || process.env.SERVER_PORT || 5000));
module.exports = app; // Make available for mocha testing suites.

// Connect Express sub-module controllers.
app.use('/server/session', require('./controllers/session'));
app.use('/server/account', require('./controllers/account'));
app.use('/server/donation', require('./controllers/donation'));
app.use('/server/delivery', require('./controllers/delivery'));
app.use('/server/notification', require('./controllers/notification'));
app.use('/server/event', require('./controllers/event'));

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

initSSE(app);
initDbConnectionPool().then(() =>
  // Only start receiving requests once the database has initialized.
  app.listen(app.get('port'), () =>
    console.log(`Node app is running on port: ${app.get('port')}`)
  )
).catch(console.error);
