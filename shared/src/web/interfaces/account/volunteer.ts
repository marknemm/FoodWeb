/**
 * Volunteer information that is associated with a `Volunteer` type account on the platform.
 */
export interface Volunteer {
  /**
   * The auto-generated integer ID of the volunteer.
   */
  id?: number;
  /**
   * The last name (surname) of the volunteer.
   */
  lastName: string;
  /**
   * The first name of the volunteer.
   */
  firstName: string;
  /**
   * Whether or not the volunteer has signed the agreement presented to them at a training session.
   */
  signedAgreement: boolean;
}
