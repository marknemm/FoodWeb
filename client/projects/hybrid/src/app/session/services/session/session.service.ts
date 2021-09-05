import { Injectable } from '@angular/core';
import { PerpetualSession } from '~shared';
import { SessionService as WebSessionService } from '~web/session/services/session/session.service';
export { Account } from '~web/session/services/session/session.service';

/**
 * The hybrid app extension of the base web SessionService,
 * which contains extra accessor and methods for `PerpetualSession` data.
 *
 * A `PerpetualSession` is used to keep an app logged in even after
 * its web cookie based session expires.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService extends WebSessionService {

  /**
   * Gets saved perpetual session data saved locally on the client device.
   */
  get perpetualSession(): PerpetualSession {
    return this.sessionStore.snapshot.perpetualSession;
  }

  /**
   * Saves perpetual session data on the client device.
   * @param perpetualSession The perpetual session to save.
   */
  savePerpetualSession(perpetualSession: PerpetualSession): void {
    this.sessionStore.set('perpetualSession', perpetualSession);
  }

  /**
   * Deletes perpetual session data held on the client device.
   */
  deletePerpetualSession(): void {
    this.sessionStore.remove('perpetualSession');
  }
}
