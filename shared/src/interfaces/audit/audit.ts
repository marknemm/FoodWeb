/**
 * An audit event type. Gives context to an Audit entry.
 */
export type AuditEventType =
  'Signup'
  | 'Verify Account'
  | 'Remove Unverified Account'
  | 'Update Account'
  | 'Request Password Reset'
  | 'Reset Password'
  | 'Donate'
  | 'Update Donation'
  | 'Remove Donation'
  | 'Claim Donation'
  | 'Unclaim Donation'
  | 'Schedule Delivery'
  | 'Pickup Delivery'
  | 'Complete Delivery';

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
   * The timestamp of when the audit event occured.
   */
  timestamp?: string;
}
