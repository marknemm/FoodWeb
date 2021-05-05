/**
 * Contact information that is associated with an account on the platform.
 */
export interface SubjectInfo {
  /**
   * The account email.
   */
  name: string;
  /**
   * The account phone number.
   */
  email: string;
  /**
   * The account owner's street address specifying place of residence if the account type is `Volunteer`.
   * Otherwise, it will be the place of business operation for `Donor` & `Receiver` accounts.
   */
  subject: string;
  /**
   * The account owner's city.
   */
  body: string;
}
