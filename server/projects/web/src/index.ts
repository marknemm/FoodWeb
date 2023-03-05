import { Application, Request, Response, Router } from 'express';
import 'reflect-metadata';
import { env, initEnv } from './helpers/globals/env';
import { appPaths, initPaths } from './helpers/globals/paths';
import express = require('express');
import path = require('path');

initPaths('web', __dirname); // Initialize all global path constants and TS config path mappings for server.
const app: Application = express();

// Initialize & preprocess env variables either directly set in production server ENV or local `.env` file.
initEnv()
  // Initialize all app middleware that pre-processes requests before being handled by REST route handlers.
  .then(() => require('~web/middleware/init.middleware').initMiddleware(app))
  // Initialize TypeORM layer & connection so that the app may interact with the database.
  .then(require('~orm').initOrm)
  // Register REST route handlers & setup the Express app to listen for requests on the configured port.
  .then(() => {

    const webRouter: Router = require('~web/controllers/web').router;

    app.set('port', (env.PORT || env.SERVER_PORT || 5001));

    // Connect Express web sub-module controllers.
    app.use('/server', webRouter);

    // Public Resource Route Handler (for local image hosting).
    app.get('/public/*', (request: Request, response: Response) =>
      response.sendFile(path.join(appPaths.rootDir + decodeURI(request.url)))
    );

    // Food Web's Main Asset Files Such as Icon and Banner Images.
    app.get('/assets/*', (request: Request, response: Response) => {
      const assetFile: string = request.url.split('/assets/')[1];
      response.sendFile(path.join(appPaths.assetsDir, assetFile));
    });

    app.get('/.well-known/apple-app-site-association', (_: Request, response: Response) => {
      response.sendFile(
        path.join(appPaths.serverDir, '.well-known', 'apple-app-site-association'),
        { headers: { 'Content-Type': 'json' } }
      );
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
