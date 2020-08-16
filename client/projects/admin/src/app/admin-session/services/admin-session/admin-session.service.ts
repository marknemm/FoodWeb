import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountHelper } from '~shared';
import { SessionService } from '~web/session/services/session/session.service';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSessionService extends SessionService {

  constructor(
    protected _accountHelper: AccountHelper,
    protected _alertService: AlertService,
    protected _alertQueueService: AlertQueueService,
    protected _httpClient: HttpClient
  ) {
    super(_accountHelper);
  }

  /**
   * Since admins have ownership of all accounts, this will always return true.
   */
  hasAccountOwnership(accountId: number): boolean {
    return true;
  }

  /**
   * Checks whether or not a given account is this admin's account.
   * NOTE: Unlike hasAccountOwnership, this will specifically check if the account is the currently logged in admin's account.
   * @param accountId The ID of the account to check.
   * @return true if it is the admin's account, false if not.
   */
  isMyAccount(accountId: number): boolean {
    return this._accountHelper.doesAccountIdMatch(this.account, accountId);
  }
}
