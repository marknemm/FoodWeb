import { json } from 'body-parser';
import { Application } from 'express';
import { JSONDateReviver } from '~shared';
import { appPaths } from '~web/helpers/globals/paths';
import { cors } from '~web/middleware/cors.middleware';
import { session } from '~web/middleware/session.middleware';
import compression = require('compression');
import multer = require('multer');
import boolParser = require('express-query-boolean');
import intParser = require('express-query-int');
import express = require('express');
import { requireHTTPS } from './require-https.middleware';

/**
 * Initializes all middleware for a given Express app.
 * @param app The Express Application container.
 * @return {Promise<void>} A promise that resolves once all middleware is initialized.
 */
export async function initMiddleware(app: Application) {
  // Monkey patch JSON.parse to revive dates in JSON requests by converting date strings to Date objects.
  new JSONDateReviver().initJSONDateReviver();

  // Init all middleware with sync init processing.
  app.use(requireHTTPS);
  app.use(cors);
  app.use(compression());
  app.use(json());
  app.use(multer().any());
  app.use(boolParser());
  app.use(intParser());
  app.use(express.static(appPaths.clientBuildDir));
  app.use(express.static(appPaths.publicDir));

  // Init all middleware with async init processing.
  app.use(await session());
}
