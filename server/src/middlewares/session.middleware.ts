import 'dotenv';
import session = require('express-session');
import connectRedis = require('connect-redis');
import { NextFunction, Request, Response } from 'express';
import { SessionOptions } from 'express-session';
import { RedisStoreOptions } from 'connect-redis';
import { Account } from '../../../shared/src/interfaces/account';
export { Account };

const RedisStore = connectRedis(session);

/**
 * Generates session options for session middleware bootstrap.
 * @return The generated session options.
 */
export function genSessionOpts(): SessionOptions {
  const ttlMs: number = parseInt(process.env.SESSION_TTL_MS, 10);
  const DEVELOPMENT: boolean = (process.env.DEVELOPMENT === 'true');
  const sessionOpts: SessionOptions = DEVELOPMENT ?
    _genMemStoreSessionOpts(ttlMs) :
    _genRedisSessionOpts(ttlMs);
  return sessionOpts;
}

/**
 * Middleware that ensures that there is an active session for the client issuing the request.
 * If an active session exists (meaning that the user is logged in), then the next route handler is called.
 * If an active session does not exist, then an appropriate response is returned and the next handler is not called.
 * @param request The request from the client (holds any active session data).
 * @param response The response to the client.
 * @param next A callback that when called will execute the next route handler.
 */
export function ensureSessionActive(request: Request, response: Response, next: NextFunction): void {
  if (request.session['account'] != null) {
    next();  // Call the next route handler.
  } else {
    // Since session is inactive, then we will send login required response and not call next route handler!
    response.status(0).send('Login required');
  }
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
