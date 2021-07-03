import { MobileDevice } from '../mobile-device';

/**
 * A request sent when the user is attempting to login.
 */
export interface LoginRequest {
  /**
   * The user's login username or email associated with their account.
   */
  usernameEmail: string;
  /**
   * The user's login password.
   */
  password: string;
  /**
   * Mobile device data that should be present when a user attempts to login
   * via a mobile device (smartphone/tablet).
   */
  mobileDevice?: MobileDevice;
}
