import 'dotenv';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Account } from '~shared';
import { getRedisUrl } from '~web/helpers/misc/redis-store';
import expressSession = require('express-session');
import connectRedis = require('connect-redis');
export { Account };

/**
 * Generates the express session middleware request handler.
 * @return the express session middleware request handler.
 */
export async function session(): Promise<RequestHandler> {
  const ttlMs: number = parseInt(process.env.SESSION_TTL_MS, 10);
  const RedisSessionStore = connectRedis(expressSession);

  return expressSession({
    secret: process.env.SESSION_SECRET,
    store: new RedisSessionStore({
      url: await getRedisUrl(),
      ttl: (ttlMs / 1000), // NOTE: Time-to-live here is in seconds!
      pass: process.env.REDIS_PASSWORD,
      logErrors: (process.env.LOG_CONSOLE_REDIS_ERRS === 'true')
    }),
    saveUninitialized: false,
    resave: false,
    rolling: true,
  });
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
