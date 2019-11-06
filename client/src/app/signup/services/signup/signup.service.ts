import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SessionService } from '../../../session/services/session/session.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler/error-handler.service';
import { PageProgressService } from '../../../shared/services/page-progress/page-progress.service';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { AccountCreateRequest } from '../../../../../../shared/src/interfaces/account/account-create-request';
import { Account } from '../../../../../../shared/src/interfaces/account/account';
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
      const request: AccountCreateRequest = { account, password };
      this._pageProgressService.activate(true);
      this._loading = true;
      this._httpClient.post<Account>(this.url, request, { withCredentials: true }).pipe(
        mergeMap((account: Account) => this._sessionService.login(account.username, password, true)),
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
