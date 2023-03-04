import { NextFunction, Request, Response } from 'express';
import { env } from '~web/helpers/globals/env';

/**
 * Requires that all incoming requests use https:// protocol for security.
 * @param req The incoming request.
 * @param res The outgoing response.
 * @param next A callback that when called will execute the next route handler.
 */
export function requireHTTPS(req: Request, res: Response, next: NextFunction) {
  // The 'x-forwarded-proto' check is for Heroku
  (!req.secure && req.get('x-forwarded-proto') !== 'https' && !env.DEVELOPMENT)
    ? res.redirect('https://' + req.get('host') + req.url)
    : next();
}
