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
global['rootDir'] = path.join(__dirname, '..', '..', '..', '..', '..', '..');
global['serverDir'] = path.join(global['rootDir'], 'server');
global['serverAdminDir'] = path.join(global['serverDir'], 'projects', 'admin');
global['serverWebDir'] = path.join(global['serverDir'], 'projects', 'web');
global['serverDbDumpDir'] = path.join(global['serverDir'], 'database', 'util', 'dump');
global['clientDir'] = path.join(global['rootDir'], 'client');
global['clientBuildDir'] = path.join(global['clientDir'], 'dist', 'admin');
global['assetsDir'] = path.join(global['clientBuildDir'], 'assets');
global['clientEmailDir'] = path.join(global['clientDir'], 'email');
global['publicDir'] = path.join(global['rootDir'], 'public');

// Setup path alias resolution for JS.
const tsconfigPathname: string = path.join(global['serverAdminDir'], 'tsconfig.json');
const tsconfig = require(tsconfigPathname);
tsConfigPaths.register({
  baseUrl: path.join(__dirname, '..'), // This is the /dist/server/projects/admin dir.
  paths: tsconfig.compilerOptions.paths
});

// Load .env into process (pre-set environment variables on machine take precedence).
if (!PRODUCTION && !QA) {
  const envPath: string = path.join(global['serverAdminDir'], '.env');
  dotenv.config({ path: envPath });
  if (!process.env.SERVER_PORT) {
    throw new Error(`Incorrect path to .env config file: ${envPath}`);
  }
}

// Override dist directory in dev environment due to conflict between parallel web & admin builds.
const DIST_DIR: string = (PRODUCTION || QA || !process.env['DEV_DIST_DIR']) ? 'dist' : process.env['DEV_DIST_DIR'];
global['serverDistDir'] = path.join(global['serverDir'], DIST_DIR, 'server');
global['emailTemplatesDir'] = path.join(global['serverDistDir'], 'templates', 'email');

if (process.env.ADMIN !== 'true') {
  throw new Error('Attempting to start ADMIN server without ADMIN env set to true');
}

// These must be imported after loading .env into process since they require access to environment variables.
import { initOrm } from '~orm';
import { JSONDateReviver } from '~shared';
import { cors } from '~web/middlewares/cors.middleware';
import { recaptcha } from '~web/middlewares/recaptcha.middleware';
import { session } from '~web/middlewares/session.middleware';
import { ensureSessionAdmin } from '~admin/middlewares/admin-session.middleware';
import { router as sessionRouter } from '~admin/controllers/admin-session';
import { router as adminRouter } from '~admin/controllers/admin';

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
app.use(session);
app.use(recaptcha);
app.use(express.static(global['clientBuildDir']));
app.use(express.static(global['publicDir']));
app.set('port', (process.env.PORT || process.env.SERVER_PORT || 5000));

// Connect Express admin session sub-module controller. This will be the only un-authenticated route (for login).
app.use('/server/session', sessionRouter);
app.use('/server', ensureSessionAdmin, adminRouter);

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
