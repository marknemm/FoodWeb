import 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { Account } from '~shared';
export { Account };

const _adminAccountIds: number[] = process.env.ADMIN_ACCOUNT_IDS.split(',').map(
  (idStr: string) => Number.parseInt(idStr, 10)
);

/**
 * Middleware that ensures that there is an active admin session for the client issuing the request.
 * If an active session admin exists (meaning that the user is logged in and is part of the admin group), then the next route handler is called.
 * If an active session does not exist, or the user is not an admin, then an appropriate response is returned and the next handler is not called.
 * @param request The request from the client (holds any active session data).
 * @param response The response to the client.
 * @param next A callback that when called will execute the next route handler.
 */
export function ensureSessionAdmin(request: Request, response: Response, next: NextFunction): void {
  console.log(request.url);
  console.log(`Session Account ID: ${request.session.account?.id}`);
  console.log(`Admin Account IDs: ${_adminAccountIds.toString()}`);
  if (request.url.indexOf('/session') >= 0 || (request.session.account && _adminAccountIds.indexOf(request.session.account.id) >= 0)) {
    next(); // Call the next route handler.
  } else {
    response.status(302).send({ message: 'Admin Authentication required' });
  }
}
