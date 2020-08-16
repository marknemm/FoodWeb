import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { Account, SignupRequest } from '~shared';
import { environment } from '~web/../environments/environment';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

export interface PasswordUpdate {
  password: string;
  oldPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  readonly url = `${environment.server}/account`;

  private _loading = false;

  constructor(
    private _authService: AuthenticationService,
    private _httpClient: HttpClient,
    private _alertQueueService: AlertQueueService,
    private _pageProgressService: PageProgressService,
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  createAccount(account: Account, password: string, agreed: boolean): void {
    if (agreed) {
      const signupRequest: SignupRequest = { account, password };
      this._pageProgressService.activate(true);
      this._loading = true;
      this._httpClient.post<Account>(this.url, signupRequest, { withCredentials: true }).pipe(
        mergeMap(() => this._authService.login(account.username, signupRequest.password, true)),
        catchError((err: HttpErrorResponse) => this._alertQueueService.add(err)),
        finalize(() => {
          this._pageProgressService.reset();
          this._loading = false;
        })
      ).subscribe();
    } else {
      this._alertQueueService.add('You must accept the terms and conditions to complete signup');
    }
  }
}
