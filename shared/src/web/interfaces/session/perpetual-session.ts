/**
 * Perpetual session that allows the user to automatically refresh their web-based session
 * from a saved long-lived session token.
 */
export interface PerpetualSession {
  /**
   * A unique perpetual session token that will never expire.
   * Ensures that the user may remain logged in even when the web cookie based session expires.
   */
  sessionToken: string;

  /**
   * The auto-generated database ID for the session.
   */
  id?: number;
  /**
   * The creation timestmap of the session.
   */
  createTimestamp?: Date;
}
