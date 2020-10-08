import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '~admin-env/environment';
import { Account, ImpersonateTokenResponse } from '~shared';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class ImpersonateService {

  readonly url = `${environment.server}/session/impersonate-token`;

  constructor(
    private _alertService: AlertService,
    private _alertQueueService: AlertQueueService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService,
    private _window: Window,
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
      catchError((err: HttpErrorResponse) => this._alertQueueService.add(err)),
      finalize(() => this._pageProgressService.reset())
    ).subscribe((response: ImpersonateTokenResponse) => {
      this._alertService.displaySimpleMessage('User Impersonation Successful', 'success');
      this._window.open(`${environment.webServer}/home/login?impersonationToken=${response.impersonationToken}`, '_blank');
    });
  }
}
