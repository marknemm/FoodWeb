/**
 * A record that is the value in a key-value pair with an impersonation token as the associated key.
 * Used to share impersonation rules between an admin and web server.
 */
export interface ImpersonateRecord {
  /**
   * The admin account ID that is allowed to impersonate the target account on the standard web server.
   */
  adminAccountId: number;
  /**
   * The ID of the target impersonation account.
   */
  targetAccountId: number;
}
