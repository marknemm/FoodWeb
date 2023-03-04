import * as admin from 'firebase-admin';
import { isEmpty } from 'lodash';
import { appPaths } from './paths';
import dotenv = require('dotenv');
import path = require('path');

/**
 * A typed version of process.env that should contain all environment variables that are converted to their refined types.
 */
export let env: FoodWebEnv = {};

/**
 * FoodWeb environment variables.
 */
export interface FoodWebEnv {
  ADMIN?: boolean;
  ADMIN_ACCOUNT_IDS?: number[];
  ADMIN_EMAILS?: string[];
  CORS_WHITELIST?: string[];
  COUNTRY?: string;
  DATABASE_DATABASE?: string;
  DATABASE_HOST?: string;
  DATABASE_LOGGER?: string;
  DATABASE_LOGGING?: boolean;
  DATABASE_MIGRATIONS_RUN?: boolean;
  DATABASE_PASSWORD?: string;
  DATABASE_PORT?: number;
  DATABASE_REJECT_UNAUTHORIZED?: boolean;
  DATABASE_SSL?: boolean;
  DATABASE_SYNC?: boolean;
  DATABASE_URL?: string;
  DATABASE_USERNAME?: string;
  DEVELOPMENT?: boolean;
  DIRECTIONS_API_KEY?: string;
  DISTANCE_TIME_API_KEY?: string;
  FIREBASE_SERVICE_ACCOUNT?: admin.ServiceAccount;
  GEOCODER_API_KEY?: string;
  GEOCODER_FORMATTER_PATTERN?: string;
  GEOCODER_FORMATTER?: string;
  GEOCODER_HTTP_ADAPTER?: string;
  GEOCODER_PROVIDER?: string;
  JOB_NAME?: string;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
  NOREPLY_EMAIL?: string;
  NOREPLY_PASSWORD?: string;
  NOREPLY_PORT?: number;
  NOREPLY_SECURE?: boolean;
  NOREPLY_SERVER?: string;
  NOREPLY_TLS_REJECT_UNAUTHORIZED?: boolean;
  NOREPLY_USERNAME?: string;
  OFFLINE_MODE?: boolean;
  PORT?: number;
  PRODUCTION_HOST_ADDRESS_READABLE?: string;
  PRODUCTION_HOST_ADDRESS?: string;
  PRODUCTION?: boolean;
  QA?: boolean;
  REDIS_PASSWORD?: string;
  REDIS_SSL?: boolean;
  REDIS_TLS_URL?: string;
  REDIS_URL?: string;
  SERVER_HOST_ADDRESS_READABLE?: string;
  SERVER_HOST_ADDRESS?: string;
  SERVER_PORT?: number;
  SESSION_SECRET?: string;
  SESSION_TTL_MS?: number;
  SUPPORT_EMAIL?: string;
  SUPPORT_PASSWORD?: string;
  SUPPORT_PORT?: number;
  SUPPORT_SECURE?: boolean;
  SUPPORT_SERVER?: string;
  SUPPORT_TLS_REJECT_UNAUTHORIZED?: boolean;
  SUPPORT_USERNAME?: string;
  UNRECORDED_DONATION_COUNT?: number;
  UNRECORDED_MEAL_COUNT?: number;
}

/**
 * Initializes Express app environment variables from SSM (Simple Site Manager) Parameter Store variables.
 * If the environment is DEVELOPMENT, then initializes the environment variables from a local .env file.
 * @return A promise that resolves to the initialized FoodWeb environment variable set.
 */
export async function initEnv(): Promise<FoodWebEnv> {
  if (isEmpty(env)) {
    // If in a development environment, load environment variables from .env file.
    if (process.env.PRODUCTION !== 'true' && process.env.QA !== 'true') {
      const envDir: string = appPaths.serverProjectDir;

      (envDir)
        ? dotenv.config({ path: path.join(envDir, '.env') })
        : dotenv.config(); // Auto-lookup .env in current/parent directories.

      if (!process.env.SERVER_PORT) {
        throw new Error('Could not resolve the .env file' + envDir ? ` with envDir: ${envDir}` : '');
      }
    }

    env = refineEnv();
  }
  return env;
}

/**
 * Refines the types & values of the members of the raw global process.env object without modifying it directly.
 * @return The refined FoodWeb environment variable set.
 */
function refineEnv(): FoodWebEnv {
  const rawEnv: any = process.env;
  const refinedEnv: FoodWebEnv = Object.assign({}, process.env);

  // Perform all standard automatic conversions to boolean and integer types.
  for (const envProp in refinedEnv) {
    if (typeof refinedEnv[envProp] === 'string') {
      refinedEnv[envProp] = refinedEnv[envProp].trim();

      // Attempt to parse string into primitive type, object, or array.
      if (refinedEnv[envProp] === 'undefined') {
        refinedEnv[envProp] = undefined;
      } else {
        try {
          refinedEnv[envProp] = JSON.parse(refinedEnv[envProp]);
        } catch (err) {} // Do nothing an move on if JSON parse fails.
      }
    }
  }

  refinedEnv.ADMIN_ACCOUNT_IDS = rawEnv.ADMIN_ACCOUNT_IDS
    ? (rawEnv.ADMIN_ACCOUNT_IDS).trim().split(',').map(
        (idStr: string) => Number.parseInt(idStr, 10))
    : [];
  refinedEnv.ADMIN_EMAILS = rawEnv.ADMIN_EMAILS
    ? (rawEnv.ADMIN_EMAILS).trim().split(',')
    : [];

  refinedEnv.CORS_WHITELIST = rawEnv.CORS_WHITELIST
    ? (rawEnv.CORS_WHITELIST).trim().split(',')
    : [];

  refinedEnv.COUNTRY = refinedEnv.COUNTRY ?? 'United States';

  if (!refinedEnv.DATABASE_PORT && !refinedEnv.DATABASE_URL) {
    refinedEnv.DATABASE_PORT = 5432;
  }

  refinedEnv.DEVELOPMENT = refinedEnv.DEVELOPMENT || (!refinedEnv.PRODUCTION && !refinedEnv.QA);

  refinedEnv.FIREBASE_SERVICE_ACCOUNT = JSON.parse(
    Buffer.from(rawEnv.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8')
  );

  refinedEnv.PORT = refinedEnv.PORT ?? 0; // Allow SERVER_PORT to take effect if not supplied.

  refinedEnv.PRODUCTION_HOST_ADDRESS = refinedEnv.PRODUCTION_HOST_ADDRESS ?? refinedEnv.SERVER_HOST_ADDRESS;
  refinedEnv.PRODUCTION_HOST_ADDRESS_READABLE = refinedEnv.PRODUCTION_HOST_ADDRESS_READABLE ?? refinedEnv.SERVER_HOST_ADDRESS;

  refinedEnv.SERVER_HOST_ADDRESS = refinedEnv.SERVER_HOST_ADDRESS ?? '';
  refinedEnv.SERVER_HOST_ADDRESS_READABLE = refinedEnv.SERVER_HOST_ADDRESS_READABLE ?? refinedEnv.SERVER_HOST_ADDRESS;
  refinedEnv.SERVER_PORT = refinedEnv.SERVER_PORT ?? 5000;

  refinedEnv.SESSION_TTL_MS = refinedEnv.SESSION_TTL_MS ?? 9000000;

  refinedEnv.SUPPORT_PORT = refinedEnv.SUPPORT_PORT ?? 1025;

  refinedEnv.UNRECORDED_DONATION_COUNT = refinedEnv.UNRECORDED_DONATION_COUNT ?? 0;
  refinedEnv.UNRECORDED_MEAL_COUNT = refinedEnv.UNRECORDED_MEAL_COUNT ?? 0;

  return refinedEnv;
}
