import 'dotenv';
import { RequestHandler } from 'express';
import session = require('express-session');
import { SessionOptions, MemoryStore, Store } from 'express-session';
import { RedisStoreOptions } from 'connect-redis';
import connectRedis = require('connect-redis');

/**
 * The options for express-session middleware & store.
 */
export const sessionOptions: SessionOptions = _genSessionOpts();
/**
 * The express-session store. Will be a Redis Store if not in dev mode, otherwise will be a Memory Store.
 */
export const sessionStore: Store | MemoryStore = sessionOptions.store;
/**
 * The session request handler middleware.
 */
export const sessionReqHandler: RequestHandler = session(sessionOptions);

/**
 * Generates session options for session middleware bootstrap.
 * @return The generated session options.
 */
function _genSessionOpts(): SessionOptions {
  const ttlMs: number = parseInt(process.env.SESSION_TTL_MS, 10);
  const DEVELOPMENT: boolean = (process.env.DEVELOPMENT === 'true');
  return (DEVELOPMENT)
    ? _genMemStoreSessionOpts(ttlMs)
    : _genRedisSessionOpts(ttlMs);
}

function _genMemStoreSessionOpts(ttlMs: number): SessionOptions {
  return {
    secret: process.env.SESSION_SECRET,
    store: new MemoryStore(),
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
