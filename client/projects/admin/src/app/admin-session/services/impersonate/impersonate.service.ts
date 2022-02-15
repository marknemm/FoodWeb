import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '~admin-env/environment';
import { Account, ImpersonateTokenResponse } from '~shared';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class ImpersonateService {

  readonly url = `${environment.server}/session/impersonate-token`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _window: Window,
  ) {}

  /**
   * Sends an impersonate user request to the server.
   * On success, opens the web interface in a new tab (should be logged in as the target user).
   * @param account The account of the user that is to be impersonated.
   */
  impersonateUser(account: Account): void {
    const url = `${this.url}/${account.id}`;
    this._httpClient.get<ImpersonateTokenResponse>(url, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<ImpersonateTokenResponse>({ successMessage: 'User Impersonation Successful' })
    ).subscribe((response: ImpersonateTokenResponse) => {
      this._window.open(`${environment.webClient}/home/login?impersonationToken=${response.impersonationToken}`, '_blank');
    });
  }
}
