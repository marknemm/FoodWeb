import { Application, Request, RequestHandler, Response, Router } from 'express';
import 'reflect-metadata';
import { env, initEnv } from '../../web/src/helpers/globals/env'; // Cannot use ~web/ path map until initPaths is called.
import { appPaths, initPaths } from '../../web/src/helpers/globals/paths';
import express = require('express');
import path = require('path');

// Initialize all global path constants, path mappings, and environment variables for the Express app.
initPaths('admin', __dirname);
const app: Application = express();

// Initialize & preprocess env variables either form AWS SSM Parm Store or local `.env` file.
initEnv()
  // Initialize all app middleware that pre-processes requests before being handled by REST route handlers.
  .then(() => require('~web/middleware/init.middleware').initMiddleware(app))
  // Initialize TypeORM layer & connection so that the app may interact with the database.
  .then(require('~orm').initOrm)
  // Register REST route handlers & setup the Express app to listen for requests on the configured port.
  .then(() => {

    const sessionRouter: Router = require('~admin/controllers/admin-session').router;
    const adminRouter: Router = require('~admin/controllers/admin').router;
    const ensureSessionAdmin: RequestHandler = require('~admin/middleware/admin-session.middleware').ensureSessionAdmin;

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
