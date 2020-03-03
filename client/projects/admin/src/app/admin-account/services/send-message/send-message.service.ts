import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from '~admin/environments/environment';
import { AccountReadFilters, SendMessageRequest } from '~shared';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class SendMessageService {

  readonly url = `${environment.server}/account`;

  constructor(
    private _alertService: AlertService,
    private _errorHandlerService: ErrorHandlerService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService,
  ) {}

  /**
   * Sends a request to the server to send a message to the currently filtered accounts.
   * @param sendMessageReq The message that should be sent.
   * @param accountFilters The account filters.
   * @return An observable that emits when the operation completes.
   */
  sendMessage(sendMessageReq: SendMessageRequest, accountFilters: AccountReadFilters): Observable<void> {
    const url = `${this.url}/send-message`;
    const params = new HttpParams({ fromObject: <any>accountFilters });
    this._pageProgressService.activate(true);
    return this._httpClient.post(url, sendMessageReq, { withCredentials: true, params }).pipe(
      map(() => this._alertService.displaySimpleMessage('Message Successfully Sent', 'success')),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  /**
   * Sends a request to the server to send a test message to the current user's email account.
   * @param sendMessageReq The message that should be sent.
   * @return An observable that emits when the operation completes.
   */
  testMessage(sendMessageReq: SendMessageRequest): Observable<void> {
    const url = `${this.url}/test-message`;
    this._pageProgressService.activate(true);
    return this._httpClient.post(url, sendMessageReq, { withCredentials: true }).pipe(
      map(() => this._alertService.displaySimpleMessage('Test Message Successfully Sent', 'success')),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
