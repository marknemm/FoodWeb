import { MobileDevice } from '..';
import { Account } from '../account/account';
import { PerpetualSession } from './perpetual-session';

/**
 * A response sent as a result of a login.
 */
export interface LoginResponse {
  /**
   * The account data for the user that has logged in.
   */
  account: Account;
  /**
   * The mobile device data for the user that has logged in.
   */
  mobileDevice?: MobileDevice;
  /**
   * A perpetual session token that is generated for apps that should not logout
   * after the web cookie based session expires. May be used to automatically re-establish
   * a web cookie login session without requiring user input (stored on client).
   *
   * Note: will not be present for login of basic webapp, only mobile hybrid app.
   */
  perpetualSession?: PerpetualSession;
}
