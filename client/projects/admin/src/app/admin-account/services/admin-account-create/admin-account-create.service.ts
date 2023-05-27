import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~admin-env/environment';
import { AccountCreateOptions } from '~admin/admin-account/forms/admin-account.form';
import { Account, AdminAccountCreateRequest } from '~shared';
import { ImmutableStore } from '~web/shared/classes/immutable-store';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAccountCreateService {

  readonly url = `${environment.server}/account`;
  readonly createdAccountStore = new ImmutableStore<Account>();

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  createAccount(account: Account, password: string, accountCreateOptions: AccountCreateOptions): Observable<Account> {
    const accountCreateRequest: AdminAccountCreateRequest = { account, password, accountCreateOptions };
    return this._httpClient.post<Account>(this.url, accountCreateRequest, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(this.createAccount, { immutableStore: this.createdAccountStore })
    );
  }
}
