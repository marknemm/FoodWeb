import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';
import { Account, PasswordResetRequest } from '~shared';
import { environment } from '~web-env/environment';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  readonly url = `${environment.server}/account/reset-password`;

  private _loading = false;

  constructor(
    private _authService: AuthenticationService,
    private _pageProgressSerivce: PageProgressService,
    private _httpClient: HttpClient,
    private _httpResonseService: HttpResponseService,
    private _activatedRoute: ActivatedRoute
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  sendPasswordResetEmail(usernameEmail: string): Observable<void> {
    const params = (new HttpParams()).set('usernameEmail', usernameEmail);
    this._loading = true;
    return this._httpClient.get<void>(this.url, { params, withCredentials: true }).pipe(
      this._httpResonseService.handleHttpResponse<void>({ pageProgressBlocking: false }),
      finalize(() => this._loading = false)
    );
  }

  resetPassword(password: string): Observable<Account> {
    const username: string = this._activatedRoute.snapshot.queryParamMap.get('username');
    const resetToken: string = this._activatedRoute.snapshot.queryParamMap.get('resetToken');
    const request: PasswordResetRequest = { username, password, resetToken };
    this._loading = true;
    this._pageProgressSerivce.activate(true);
    return this._httpClient.put<Account>(this.url, request, { withCredentials: true }).pipe(
      this._httpResonseService.handleHttpResponse<Account>(),
      mergeMap((account: Account) => this._authService.login(account.username, password, true)),
      finalize(() => this._loading = false)
    );
  }
}
