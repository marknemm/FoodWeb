import express = require('express');
import dotenv = require('dotenv');
import forceHttps = require('express-force-https');
import bodyParser = require('body-parser');
import multer = require('multer');
import path = require('path');
import tsConfigPaths = require('tsconfig-paths');

// Setup path alias resolution for JS.
const tsConfig = require('../../../../../tsconfig.json');
tsConfigPaths.register({
  baseUrl: path.join(__dirname, '..', '..', '..'),
  paths: tsConfig.compilerOptions.paths
});

import { Application, Request, Response } from 'express';
import 'reflect-metadata';
import { JSONDateReviver } from '~shared';

// Set important paths in global.
const PRODUCTION: boolean = (process.env['PRODUCTION']  === 'true');
const QA: boolean = (process.env['QA'] === 'true');
global['rootDir'] = path.join(__dirname, '..', '..', '..', '..', '..', '..');
global['serverDir'] = path.join(global['rootDir'], 'server');
global['serverWebDir'] = path.join(global['serverDir'], 'projects', 'web');
global['clientDir'] = path.join(global['rootDir'], 'client');
global['clientBuildDir'] = path.join(global['clientDir'], 'dist', 'web');
global['assetsDir'] = path.join(global['clientBuildDir'], 'assets');
global['clientEmailDir'] = path.join(global['clientDir'], 'email');
global['publicDir'] = path.join(global['rootDir'], 'public');
global['emailTemplatesDir'] = path.join(global['serverDir'], 'templates', 'email');

// Load .env into process (pre-set environment variables on machine take precedence).
if (!PRODUCTION && !QA) {
  const envPath: string = path.join(global['serverWebDir'], '.env');
  dotenv.config({ path: envPath });
  if (!process.env.SERVER_PORT) {
    throw new Error(`Incorrect path to .env config file: ${envPath}`);
  }
}

if (process.env.ADMIN === 'true') {
  throw new Error('Attempting to start WEB server with ADMIN env set to true');
}

// These must be imported after loading .env into process since they require access to environment variables.
import { initOrm } from '~orm/index';
import { cors } from '~web/middlewares/cors.middleware';
import { recaptcha } from '~web/middlewares/recaptcha.middleware';
import { session } from '~web/middlewares/session.middleware';

// Initialize & Configure Express App (Establish App-Wide Middleware).
const app: Application = express();
new JSONDateReviver().initJSONDateReviver();
if (PRODUCTION || QA) {
  app.use(forceHttps);
}
app.use(cors);
app.use(bodyParser.json());
app.use(multer().any());
app.use(session);
app.use(recaptcha);
app.use(express.static(global['clientBuildDir']));
app.use(express.static(global['publicDir']));
app.set('port', (process.env.PORT || process.env.SERVER_PORT || 5000));

// Connect Express sub-module controllers.
app.use('/server/account', require('~web/controllers/account'));
app.use('/server/app-data', require('~web/controllers/app-data'));
app.use('/server/delivery', require('~web/controllers/delivery'));
app.use('/server/donation', require('~web/controllers/donation'));
app.use('/server/featured-event', require('~web/controllers/featured-event'));
app.use('/server/heuristics', require('~web/controllers/heuristics'));
app.use('/server/map', require('~web/controllers/map'));
app.use('/server/notification', require('~web/controllers/notification'));
app.use('/server/session', require('~web/controllers/session'));
app.use('/server/sse', require('~web/controllers/sse'));

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
app.get('*', (_: Request, response: Response) => {
  response.sendFile(path.join(global['clientBuildDir'], 'index.html'));
});

initOrm().then(() =>
  // Only start receiving requests once the database has initialized.
  app.listen(app.get('port'), () =>
    console.log(`Node app is running on port: ${app.get('port')}`)
  )
).catch(console.error);

module.exports = app; // Make available for testing suites.
