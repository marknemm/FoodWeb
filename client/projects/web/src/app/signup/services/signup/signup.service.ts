import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { Account, SignupRequest } from '~shared';
import { environment } from '~web/../environments/environment';
import { SessionService } from '~web/session/services/session/session.service';
import { AlertService } from '~web/shared/services/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/services/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
export { Account };

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
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _sessionService: SessionService,
    private _pageProgressService: PageProgressService,
    private _alertService: AlertService
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
        mergeMap((account: Account) => this._sessionService.login(account.username, signupRequest.password, true)),
        catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
        finalize(() => {
          this._pageProgressService.reset();
          this._loading = false;
        })
      ).subscribe();
    } else {
      this._alertService.displaySimpleMessage('You must accept the terms and conditions to complete signup', 'danger');
    }
  }
}
