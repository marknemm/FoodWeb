/**
 * An audit event type. Gives context to an Audit entry.
 */
export enum AuditEventType {
  Signup = 'Signup',
  VerifyAccount = 'Verify Account',
  RemoveUnverifiedAccount = 'Remove Unverified Account',
  UpdateAccount = 'Update Account',
  UpdatePassword = 'Update Password',
  ResetPassword = 'Reset Password',
  Donate = 'Donate',
  UpdateDonation = 'Update Donation',
  RemoveDonation = 'Remove Donation',
  ClaimDonation = 'Claim Donation',
  UnclaimDonation = 'Unclaim Donation',
  ScheduleDelivery = 'Schedule Delivery',
  CancelDelivery = 'Cancel Delivery',
  DeliveryStateAdvance = 'Delivery State Advance',
  DeliveryStateUndo = 'Delivery State Undo',
  SaveAppData = 'Save App Data',
  RemoveAppData = 'Remove App Data'
}

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
  timestamp?: Date;
}
