import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Account, PasswordResetRequest } from '~shared';
import { environment } from '~web-env/environment';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  readonly url = `${environment.server}/account/reset-password`;

  constructor(
    private _authService: AuthenticationService,
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _activatedRoute: ActivatedRoute
  ) {}

  get loading(): boolean {
    return this._httpResponseService.isLoading(this);
  }

  sendPasswordResetEmail(usernameEmail: string): Observable<void> {
    const params = (new HttpParams()).set('usernameEmail', usernameEmail);
    return this._httpClient.get<void>(this.url, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<void>(this.sendPasswordResetEmail, { loaderBlocking: false })
    );
  }

  resetPassword(password: string): Observable<Account> {
    const username: string = this._activatedRoute.snapshot.queryParamMap.get('username');
    const resetToken: string = this._activatedRoute.snapshot.queryParamMap.get('resetToken');
    const request: PasswordResetRequest = { username, password, resetToken };
    return this._httpClient.put<Account>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<Account>(this.resetPassword),
      mergeMap((account: Account) => this._authService.login(account.username, password, true))
    );
  }
}
