import { appPaths } from './paths';
import dotenv = require('dotenv');
import path = require('path');

/**
 * A typed version of process.env that should contain all environemnt variables that are converted to their refined types.
 */
export let env: FoodWebEnv;

/**
 * FoodWeb environment variables.
 */
export interface FoodWebEnv {
  ADMIN?: boolean;
  ADMIN_ACCOUNT_IDS?: number[];
  ADMIN_EMAILS?: string[];
  PRODUCTION?: boolean;
  QA?: boolean;
  DEVELOPMENT?: boolean;
  SERVER_PORT?: number;
  SERVER_HOST_ADDRESS?: string;
  SERVER_HOST_ADDRESS_READABLE?: string;
  PRODUCTION_HOST_ADDRESS?: string;
  PRODUCTION_HOST_ADDRESS_READABLE?: string;
  SESSION_SECRET?: string;
  SESSION_TTL_MS?: number;
  REDIS_PASSWORD?: string;
  REDIS_URL?: string;
  REDIS_SSL?: boolean;
  DATABASE_URL?: string;
  DATABASE_USERNAME?: string;
  DATABASE_PASSWORD?: string;
  DATABASE_HOST?: string;
  DATABASE_PORT?: number;
  DATABASE_DATABASE?: string;
  DATABASE_SSL?: boolean;
  DATABASE_REJECT_UNAUTHORIZED?: boolean;
  DATABASE_LOGGING?: boolean;
  DATABASE_LOGGER?: string;
  DATABASE_SYNC?: boolean;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
  NOREPLY_USERNAME?: string;
  NOREPLY_PASSWORD?: string;
  NOREPLY_EMAIL?: string;
  NOREPLY_SERVER?: string;
  NOREPLY_PORT?: number;
  NOREPLY_SECURE?: boolean;
  NOREPLY_TLS_REJECT_UNAUTHORIZED?: boolean;
  PORT?: number;
  SUPPORT_USERNAME?: string;
  SUPPORT_PASSWORD?: string;
  SUPPORT_EMAIL?: string;
  SUPPORT_SERVER?: string;
  SUPPORT_PORT?: number;
  SUPPORT_SECURE?: boolean;
  SUPPORT_TLS_REJECT_UNAUTHORIZED?: boolean;
  COUNTRY?: string;
  GEOCODER_PROVIDER?: string;
  GEOCODER_API_KEY?: string;
  GEOCODER_HTTP_ADAPTER?: string;
  GEOCODER_FORMATTER?: string;
  GEOCODER_FORMATTER_PATTERN?: string;
  DISTANCE_TIME_API_KEY?: string;
  DIRECTIONS_API_KEY?: string;
  FCM_SENDER_ID?: string;
  FCM_SERVER_KEY?: string;
  CORS_WHITELIST?: string[];
  OFFLINE_MODE?: boolean;
  UNRECORDED_DONATION_COUNT?: number;
  UNRECORDED_MEAL_COUNT?: number;
  JOB_NAME?: string;
}

/**
 * Initializes Express app environment variables within a local/dockerized dev environment by referencing .env file.
 * If environment variables are set on the host machine/container, those will take precedence, and .env will not be referenced.
 */
export function initEnv(): void {
  // Check if prod or QA using raw environment variables since they have not been refined yet (happens below).
  const PRODUCTION: boolean = (process.env.PRODUCTION === 'true');
  const QA: boolean = (process.env.QA === 'true');

  // If in a development environment, load environment variables from .env file.
  if (!PRODUCTION && !QA) {
    const envPath: string = path.join(appPaths.serverProjectDir, '.env');
    dotenv.config({ path: envPath });

    if (!process.env.SERVER_PORT) {
      throw new Error(`Incorrect path to .env config file: ${envPath}`);
    }
  }

  // Shallow copy process.env to global env object, and refine the types & values of its members.
  env = Object.assign({}, process.env);
  refineEnv();
}

/**
 * Refines the types & values of the members of the global env object.
 */
function refineEnv(): void {
  env.ADMIN = (process.env.ADMIN === 'true');
  env.ADMIN_ACCOUNT_IDS = process.env.ADMIN_ACCOUNT_IDS
    ? (process.env.ADMIN_ACCOUNT_IDS).trim().split(',').map(
      (idStr: string) => Number.parseInt(idStr, 10)
    )
    : [];
  env.ADMIN_EMAILS = process.env.ADMIN_EMAILS
    ? (process.env.ADMIN_EMAILS).trim().split(',')
    : [];
  env.PRODUCTION = (process.env.PRODUCTION === 'true');
  env.QA = (process.env.QA === 'true');
  env.DEVELOPMENT = (process.env.DEVELOPMENT === 'true') || (!env.PRODUCTION && !env.QA);
  env.SERVER_PORT = process.env.SERVER_PORT
    ? Number.parseInt(process.env.SERVER_PORT, 10)
    : 5000;
  env.SERVER_HOST_ADDRESS = process.env.SERVER_HOST_ADDRESS ?? '';
  env.SERVER_HOST_ADDRESS_READABLE = process.env.SERVER_HOST_ADDRESS_READABLE ?? env.SERVER_HOST_ADDRESS_READABLE;
  env.PRODUCTION_HOST_ADDRESS = process.env.PRODUCTION_HOST_ADDRESS ?? env.SERVER_HOST_ADDRESS;
  env.PRODUCTION_HOST_ADDRESS_READABLE = process.env.PRODUCTION_HOST_ADDRESS_READABLE ?? env.SERVER_HOST_ADDRESS;
  env.SESSION_TTL_MS = process.env.SESSION_TTL_MS
    ? Number.parseInt(process.env.SESSION_TTL_MS, 10)
    : 9000000;
  env.REDIS_SSL = (process.env.REDIS_SSL === 'true');
  env.DATABASE_PORT = process.env.DATABASE_PORT
    ? Number.parseInt(process.env.DATABASE_PORT, 10)
    : 5432;
  env.DATABASE_SSL = (process.env.DATABASE_SSL === 'true');
  env.DATABASE_REJECT_UNAUTHORIZED = (process.env.DATABASE_REJECT_UNAUTHORIZED === 'true');
  env.DATABASE_LOGGING = (process.env.DATABASE_LOGGING === 'true');
  env.DATABASE_SYNC = (process.env.DATABASE_SYNC === 'true');
  env.NOREPLY_PORT = process.env.NOREPLY_PORT
    ? Number.parseInt(process.env.NOREPLY_PORT, 10)
    : 1025;
  env.NOREPLY_SECURE = (process.env.NOREPLY_SECURE === 'true');
  env.NOREPLY_TLS_REJECT_UNAUTHORIZED = (process.env.NOREPLY_TLS_REJECT_UNAUTHORIZED === 'true');
  env.PORT = process.env.PORT
    ? Number.parseInt(process.env.PORT, 10)
    : 0; // Allow SERVER_PORT to take effect if not supplied.
  env.SUPPORT_PORT = process.env.SUPPORT_PORT
    ? Number.parseInt(process.env.SUPPORT_PORT, 10)
    : 1025;
  env.SUPPORT_SECURE = (process.env.SUPPORT_SECURE === 'true');
  env.SUPPORT_TLS_REJECT_UNAUTHORIZED = (process.env.SUPPORT_TLS_REJECT_UNAUTHORIZED === 'true');
  env.CORS_WHITELIST = process.env.CORS_WHITELIST
    ? (process.env.CORS_WHITELIST).trim().split(',')
    : [];
  env.OFFLINE_MODE = (process.env.OFFLINE_MODE === 'true');
  env.UNRECORDED_DONATION_COUNT = process.env.UNRECORDED_DONATION_COUNT
    ? Number.parseInt(process.env.UNRECORDED_DONATION_COUNT, 10)
    : 0;
  env.UNRECORDED_MEAL_COUNT = process.env.UNRECORDED_MEAL_COUNT
    ? Number.parseInt(process.env.UNRECORDED_MEAL_COUNT, 10)
    : 0;
}
