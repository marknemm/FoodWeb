/**
 * An audit event type. Gives context to an Audit entry.
 */
export type AuditEventType =
  'Signup'
  | 'Verify Account'
  | 'Remove Unverified Account'
  | 'Update Account'
  | 'Update Password'
  | 'Reset Password'
  | 'Donate'
  | 'Update Donation'
  | 'Remove Donation'
  | 'Claim Donation'
  | 'Unclaim Donation'
  | 'Schedule Delivery'
  | 'Cancel Delivery'
  | 'Delivery State Advance'
  | 'Delivery State Undo';

export interface AuditData<T = any> {
  old?: T;
  new: T;
}

/**
 * An audit event for keeping record of all persistent data write operations in the FoodWeb platform.
 * @param T The type of the audit data for the event. Defaults to any.
 */
export interface Audit<T = any> {
  id?: number;
  /**
   * The audit event type.
   */
  eventType: AuditEventType;
  /**
   * The data associated with the audit event.
   */
  data: AuditData<T>;
  /**
   * The RECAPTCHA (v3) score assigned to the client that caused the audited event.
   */
  recaptchaScore?: number;
  /**
   * The timestamp of when the audit event occured.
   */
  timestamp?: string;
}
