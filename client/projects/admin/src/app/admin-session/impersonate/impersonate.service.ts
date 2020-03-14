import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '~admin/environments/environment';
import { Account } from '~shared';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';
import { ImpersonateTokenResponse } from '../../../../../../../shared/src';

@Injectable({
  providedIn: 'root'
})
export class ImpersonateService {

  readonly url = `${environment.server}/session/impersonate-token`;

  constructor(
    private _alertService: AlertService,
    private _errorHandlerService: ErrorHandlerService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService,
    @Inject('Window') private _window: Window
  ) {}

  /**
   * Sends an impersonate user request to the server.
   * On success, opens the web interface in a new tab (should be logged in as the target user).
   * @param account The account of the user that is to be impersonated.
   */
  impersonateUser(account: Account): void {
    const url = `${this.url}/${account.id}`;
    this._pageProgressService.activate(true);
    this._httpClient.get<ImpersonateTokenResponse>(url, { withCredentials: true }).pipe(
      catchError(this._errorHandlerService.handleError.bind(this)),
      finalize(() => this._pageProgressService.reset())
    ).subscribe((response: ImpersonateTokenResponse) => {
      this._alertService.displaySimpleMessage('User Impersonation Successful', 'success');
      this._window.open(`${environment.web}/home/login?impersonationToken=${response.impersonationToken}`, '_blank');
    });
  }
}