import 'dotenv';
import session = require('express-session');
import connectRedis = require('connect-redis');
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { SessionOptions } from 'express-session';
import { RedisStoreOptions } from 'connect-redis';
import { Account } from '../../../shared/src/interfaces/account/account';
export { Account };

export const expressSession: RequestHandler = session(_genSessionOpts());

/**
 * Middleware that ensures that there is an active session for the client issuing the request.
 * If an active session exists (meaning that the user is logged in), then the next route handler is called.
 * If an active session does not exist, then an appropriate response is returned and the next handler is not called.
 * @param request The request from the client (holds any active session data).
 * @param response The response to the client.
 * @param next A callback that when called will execute the next route handler.
 */
export function ensureSessionActive(request: Request, response: Response, next: NextFunction): void {
  if (request.session.account) {
    next(); // Call the next route handler.
  } else {
    // Since session is inactive, then we will send login required response and not call next route handler!
    response.status(302).send({ message: 'Login required' });
  }
}

/**
 * Middleware that ensures that the current user has verified their account via clicking on the e-mailed account verification link.
 * @param request The request from the client (holds any active session data).
 * @param response The response to the client.
 * @param next A callback that when called will execute the next route handler.
 */
export function ensureAccountVerified(request: Request, response: Response, next: NextFunction): void {
  const account: Account = request.session.account;
  if (account && account.verified) {
    next(); // Call the next route handler.
  } else {
    response.status(403).send({ message: 'Account verification required to access this feature. Please check your e-mail for a FoodWeb Account Verification link.' });
  }
}

/**
 * Generates session options for session middleware bootstrap.
 * @return The generated session options.
 */
function _genSessionOpts(): SessionOptions {
  const ttlMs: number = parseInt(process.env.SESSION_TTL_MS, 10);
  const DEVELOPMENT: boolean = (process.env.DEVELOPMENT === 'true');
  const sessionOpts: SessionOptions = DEVELOPMENT ?
    _genMemStoreSessionOpts(ttlMs) :
    _genRedisSessionOpts(ttlMs);
  return sessionOpts;
}

function _genMemStoreSessionOpts(ttlMs: number): SessionOptions {
  return {
    secret: process.env.SESSION_SECRET,
    cookie: {
      expires: new Date(Date.now() + ttlMs), // NOTE: Must use expires date for IE compatibility!
      maxAge: ttlMs, // The maximum age of the cookie (works in all browsers but IE...)
      httpOnly: true, // Will not be accessible by Javascript (protects against XSS attacks).
      secure: false, // https connection not required to send cookie (fine for testing).
    },
    saveUninitialized: false,
    resave: false,
    rolling: true, // Should refresh the expires
  };
}

function _genRedisSessionOpts(ttlMs: number): SessionOptions {
  const RedisStore = connectRedis(session);
  const redisOpts: RedisStoreOptions = {
    url: process.env.REDIS_URL,
    ttl: (ttlMs / 1000), // NOTE: Time-to-live here is in seconds!
    pass: process.env.REDIS_PASSWORD,
    logErrors: (process.env.LOG_CONSOLE_REDIS_ERRS === 'true'),
  };

  return {
    secret: process.env.SESSION_SECRET,
    store: new RedisStore(redisOpts),
    saveUninitialized: false,
    resave: false,
    rolling: true,
  };
}
