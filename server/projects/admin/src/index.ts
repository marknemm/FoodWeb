import 'reflect-metadata';
import { Application, Request, Response } from 'express';
import { appPaths, initPaths } from '../../web/src/helpers/globals/paths'; // Cannot use ~web/ path map until initPaths is called.
import { initEnv } from '../../web/src/helpers/globals/env'; // Cannot use ~web/ path map until initPaths is called.
import express = require('express');
import path = require('path');

// Initialize all global path constants, path mappings, and environment variables for the Express app.
initPaths('admin', __dirname);
initEnv();

// These must be imported after loading .env into process since they require access to environment variables.
import { env } from '~web/helpers/globals/env';
import { initOrm } from '~orm';
import { ensureSessionAdmin } from '~admin/middlewares/admin-session.middleware';
import { router as sessionRouter } from '~admin/controllers/admin-session';
import { router as adminRouter } from '~admin/controllers/admin';
import { initMiddleware } from '~web/middlewares/init.middleware';

// Initialize & Configure Express App (Establish App-Wide Middleware).
const app: Application = express();

initMiddleware(app) // Initialize all app middleware that pre-processes requests before being handled by REST route handlers.
  .then(initOrm)    // Initialize TypeORM layer & connection so that the app may interact with the database.
  .then(() => {     // Register REST route handlers & setup the Express app to listen for requests on the configured port.

    app.set('port', (env.PORT || env.SERVER_PORT || 5001));

    // Connect Express admin session sub-module controller. This will be the only un-authenticated route (for login).
    app.use('/server/session', sessionRouter);
    app.use('/server', ensureSessionAdmin, adminRouter);

    // Public Resource Route Handler (for local image hosting).
    app.get('/public/*', (request: Request, response: Response) =>
      response.sendFile(path.resolve(appPaths.rootDir + decodeURI(request.url)))
    );

    // Food Web's Main Asset Files Such as Icon and Banner Images.
    app.get('/assets/*', (request: Request, response: Response) => {
      const assetFile: string = request.url.split('/assets/')[1];
      response.sendFile(path.resolve(appPaths.assetsDir, assetFile));
    });

    // All Remaining Routes Handler (for serving our main web page).
    app.get('*', (_: Request, response: Response) =>
      response.sendFile(path.join(appPaths.clientBuildDir, 'index.html'))
    );

    // Only start receiving requests once the database has initialized.
    app.listen(app.get('port'), () =>
      console.log(`Node app is running on port: ${app.get('port')}`)
    );

  })
  .catch(console.error);

module.exports = app; // Make available for testing suites.
