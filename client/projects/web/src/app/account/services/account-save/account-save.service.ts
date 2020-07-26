import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Account, AccountSectionUpdateReqeust, PasswordUpdateRequest } from '~shared';
import { environment } from '~web/../environments/environment';
import { PasswordFormT } from '~web/account/forms/account.form';
import { SessionService } from '~web/session/services/session/session.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class AccountSaveService {

  readonly url = `${environment.server}/account`;

  constructor(
    private _httpClient: HttpClient,
    private _httpRepsonseService: HttpResponseService,
    private _sessionService: SessionService
  ) {}

  /**
   * Updates a given account section within a given account.
   * @param account The account that is to have its section updated.
   * @param sectionName The name of the account section/property that is to be updated.
   * @return An observable that emits the updated account once the server operation completes.
   */
  updateAccountSection(account: Account, sectionName: keyof Account): Observable<Account> {
    const url = `${this.url}/${account.id}/section`;
    const accountSectionUpdtReq: AccountSectionUpdateReqeust = {
      accountSectionName: sectionName,
      accountSection: account[sectionName]
    };
    return this._httpClient.put<Account>(url, accountSectionUpdtReq, { withCredentials: true }).pipe(
      tap((savedAccount: Account) => this._updateAccountSessionData(savedAccount)),
      this._httpRepsonseService.handleHttpResponse({ successMessage: 'Account update successful' })
    );
  }

  /**
   * Updates client-side session data for a newly saved account.
   * If the saved account does not have the same ID as the account session on record, then forgoes the update.
   * @param savedAccount The saved account.
   */
  private _updateAccountSessionData(savedAccount: Account): void {
    if (savedAccount.id === this._sessionService.account.id) {
      this._sessionService.account = savedAccount;
    }
  }

  /**
   * Updates the password for a given account.
   * @param account The account that is to have its password updated.
   * @param passwordUpdate The password update data.
   * @return An observable that emits once the password update operation completes on the server.
   */
  updatePassword(account: Account, passwordUpdate: PasswordFormT): Observable<void> {
    const url = `${this.url}/${account.id}/password`;
    const request: PasswordUpdateRequest = passwordUpdate;
    return this._httpClient.put<void>(url, request, { withCredentials: true }).pipe(
      this._httpRepsonseService.handleHttpResponse({ successMessage: 'Password update successful' })
    );
  }
}
