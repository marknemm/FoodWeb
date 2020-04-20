import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountCreateOptions } from '~admin/admin-account/admin-account.form';
import { environment } from '~admin/environments/environment';
import { Account, AccountCreateRequest } from '~shared';
import { HttpResponseService } from '~web/shared/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {

  readonly url = `${environment.server}/account`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  createAccount(account: Account, password: string, accountCreateOptions: AccountCreateOptions): Observable<any> {
    const accountCreateRequest: AccountCreateRequest = { account, password, accountCreateOptions };
    return this._httpClient.post<Account>(this.url, accountCreateRequest, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }
}
