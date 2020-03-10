/**
 * A response that grants the admin's browser a one-time use token that allows them to impersonate a standard user within the standard web interface.
 */
export interface ImpersonateTokenResponse {
  /**
   * The impersonation token that is to be automatically used by the admin's browser within the web interface to gain impersonation access.
   * Acts as a key for looking up the impersonation record which is placed in a shared Redis store.
   * The impersonation record specifies the ID of the admin account that is allowed to impersonate,
   * and the ID of the target standard account of the impersonation.
   */
  impersonationToken: string;
}
