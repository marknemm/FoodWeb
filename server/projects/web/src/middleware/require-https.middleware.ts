import { NextFunction, Request, Response } from 'express';
import { env } from '~web/helpers/globals/env';

/**
 * Requires that all incoming requests use https:// protocol for security.
 * @param req The incoming request.
 * @param res The outgoing response.
 * @param next A callback that when called will execute the next route handler.
 */
export function requireHTTPS(req: Request, res: Response, next: NextFunction) {
  (req.header('x-forwarded-proto') !== 'https' && !env.DEVELOPMENT && !env.NO_HTTPS)
    ? res.redirect('https://' + req.headers.host + req.url)
    : next();
}
