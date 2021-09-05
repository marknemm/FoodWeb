import { Account, PerpetualSession } from '~shared';

export const SESSION_STORE_ID = 'Session';

export interface SessionStore {
  account?: Account;
  perpetualSession?: PerpetualSession;
}
