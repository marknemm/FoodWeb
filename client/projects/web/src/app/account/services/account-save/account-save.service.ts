import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Account, AccountUpdateRequest, PasswordUpdateRequest } from '~shared';
import { environment } from '~web-env/environment';
import { PasswordFormT } from '~web/account-shared/forms/account.form';
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
   * @param originalAccount The original account prior to any updates.
   * @param updateData The raw account update form data.
   * @param updateFields The names of the account fields that should be updated. Supports dot-notation for nested fields.
   * @return An observable that emits the updated account once the server operation completes.
   */
  updateAccountFields(originalAccount: Account, updateData: Account, fields: string[]): Observable<Account> {
    const url = `${this.url}/${originalAccount.id}`;

    // Generate the account update that shall be saved on the server.
    const accountUpdate = <Account>this.mergeAccountUpdateFields(updateData, _.cloneDeep(originalAccount), fields);
    const accountSectionUpdtReq: AccountUpdateRequest = { account: accountUpdate };

    // Send the account update request to the server.
    return this._httpClient.put<Account>(url, accountSectionUpdtReq, { withCredentials: true }).pipe(
      tap((savedAccount: Account) => this._updateAccountSessionData(savedAccount)),
      this._httpRepsonseService.handleHttpResponse({ successMessage: 'Account update successful' })
    );
  }

  /**
   * Merges a given list of account update fields from a given src account to a dest account.
   * @param src The source account that shall have its fields merged into dest.
   * @param dest The dest account that will be internally modified by the merge.
   * @param fields The names of the account fields that should be merged. Supports dot-notation for nested fields.
   * @return The dest account.
   */
  mergeAccountUpdateFields(src: Partial<Account>, dest: Partial<Account>, fields: string[]): Partial<Account> {
    if (fields) {
      for (const field of fields) {
        _.set(dest, field, _.get(src, field));
      }
    }
    return dest;
  }

  /**
   * Updates client-side session data for a newly saved account.
   * If the saved account does not have the same ID as the account session on record, then forgoes the update.
   * @param savedAccount The saved account.
   */
  private _updateAccountSessionData(savedAccount: Account): void {
    if (savedAccount.id === this._sessionService.account.id) {
      this._sessionService.saveAccount(savedAccount);
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
