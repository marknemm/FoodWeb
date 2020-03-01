import { NextFunction, Request, Response } from 'express';
import { verifyAccountIsAdmin } from '~admin/helpers/admin-verification';

/**
 * Middleware that ensures that there is an active admin session for the client issuing the request.
 * If an active session admin exists (meaning that the user is logged in and is part of the admin group), then the next route handler is called.
 * If an active session does not exist, or the user is not an admin, then an appropriate response is returned and the next handler is not called.
 * @param request The request from the client (holds any active session data).
 * @param response The response to the client.
 * @param next A callback that when called will execute the next route handler.
 */
export function ensureSessionAdmin(request: Request, response: Response, next: NextFunction): void {
  if (request.session.account && verifyAccountIsAdmin(request.session.account)) {
    next(); // Call the next route handler.
  } else {
    response.status(302).send({ message: 'Admin Authentication required' });
  }
}
