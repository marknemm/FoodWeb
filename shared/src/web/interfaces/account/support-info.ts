/**
 * Contact information that is associated with an account on the platform.
 */
export interface SupportInfo {
  /**
   * Users name.
   */
  name: string;
  /**
   * Users email.
   */
  email: string;
  /**
   * Subject header for the email
   */
  subject: string;
  /**
   * Email message body
   */
  body: string;
}
