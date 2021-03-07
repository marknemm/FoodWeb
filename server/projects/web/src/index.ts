import express = require('express');
import dotenv = require('dotenv');
import forceHttps = require('express-force-https');
import compression = require('compression');
import multer = require('multer');
import path = require('path');
import tsConfigPaths = require('tsconfig-paths');
import { json } from 'body-parser';
import { Application, Request, Response } from 'express';
import 'reflect-metadata';

// Set important paths in global.
const PRODUCTION: boolean = (process.env['PRODUCTION']  === 'true');
const QA: boolean = (process.env['QA'] === 'true');
global['rootDir']           = path.join(__dirname, '..', '..', '..', '..', '..', '..');
global['serverDir']         = path.join(global['rootDir'], 'server');
global['serverWebDir']      = path.join(global['serverDir'], 'projects', 'web');
global['serverDistDir']     = path.join(global['serverDir'], 'dist', 'server');
global['clientDir']         = path.join(global['rootDir'], 'client');
global['clientBuildDir']    = path.join(global['clientDir'], 'dist', 'web');
global['assetsDir']         = path.join(global['clientBuildDir'], 'assets');
global['clientEmailDir']    = path.join(global['clientDir'], 'email');
global['publicDir']         = path.join(global['rootDir'], 'public');
global['emailTemplatesDir'] = path.join(global['serverDistDir'], 'templates', 'email');

// Setup path alias resolution for JS.
const tsconfigPathname: string = path.join(global['serverWebDir'], 'tsconfig.json');
const tsconfig = require(tsconfigPathname);
tsConfigPaths.register({
  baseUrl: path.join(__dirname, '..'), // This is the /dist/server/projects/web dir.
  paths: tsconfig.compilerOptions.paths
});

// Load .env into process (pre-set environment variables on machine take precedence).
if (!PRODUCTION && !QA) {
  const envPath: string = path.join(global['serverWebDir'], '.env');
  dotenv.config({ path: envPath });
  if (!process.env.SERVER_PORT) {
    throw new Error(`Incorrect path to .env config file: ${envPath}`);
  }
}

// Override dist directory in dev environment due to conflict between parallel web & admin builds.
const DIST_DIR: string = (PRODUCTION || QA || !process.env['DEV_DIST_DIR']) ? 'dist' : process.env['DEV_DIST_DIR'];
global['serverDistDir'] = path.join(global['serverDir'], DIST_DIR, 'server');

if (process.env.ADMIN === 'true') {
  throw new Error('Attempting to start WEB server with ADMIN env set to true');
}

// These must be imported after loading .env into process since they require access to environment variables.
import { initOrm } from '~orm';
import { JSONDateReviver } from '~shared';
import { cors } from '~web/middlewares/cors.middleware';
import { recaptcha } from '~web/middlewares/recaptcha.middleware';
import { session } from '~web/middlewares/session.middleware';
import { router as webRouter } from '~web/controllers/web';
import boolParser = require('express-query-boolean');
import intParser = require('express-query-int');

// Initialize & Configure Express App (Establish App-Wide Middleware).
const app: Application = express();
new JSONDateReviver().initJSONDateReviver();
if (PRODUCTION || QA) {
  app.use(forceHttps);
}
app.use(cors);
app.use(compression());
app.use(json());
app.use(multer().any());
app.use(boolParser());
app.use(intParser());
app.use(recaptcha);
app.use(express.static(global['clientBuildDir']));
app.use(express.static(global['publicDir']));
app.set('port', (process.env.PORT || process.env.SERVER_PORT || 5000));

session()
  .then(app.use.bind(app))
  .then(initOrm)
  .then(() => {
    // Connect Express web sub-module controllers.
    app.use('/server', webRouter);

    // Public Resource Route Handler (for local image hosting).
    app.get('/public/*', (request: Request, response: Response) =>
      response.sendFile(path.resolve(global['rootDir'] + decodeURI(request.url)))
    );

    // Food Web's Main Asset Files Such as Icon and Banner Images.
    app.get('/assets/*', (request: Request, response: Response) => {
      const assetFile: string = request.url.split('/assets/')[1];
      response.sendFile(path.resolve(global['assetsDir'], assetFile));
    });

    // All Remaining Routes Handler (for serving our main web page).
    app.get('*', (_: Request, response: Response) =>
      response.sendFile(path.join(global['clientBuildDir'], 'index.html'))
    );

    // Only start receiving requests once the database has initialized.
    app.listen(app.get('port'), () =>
      console.log(`Node app is running on port: ${app.get('port')}`)
    );
  })
  .catch(console.error);

module.exports = app; // Make available for testing suites.
