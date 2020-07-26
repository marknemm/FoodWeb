import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~admin/environments/environment';
import { AccountReadFilters, SendMessageRequest } from '~shared';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAccountMessageService {

  readonly url = `${environment.server}/account`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
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
    return this._httpClient.post(url, sendMessageReq, { withCredentials: true, params }).pipe(
      this._httpResponseService.handleHttpResponse<void>({ successMessage: 'Message Successfully Sent' })
    );
  }

  /**
   * Sends a request to the server to send a test message to the current user's email account.
   * @param sendMessageReq The message that should be sent.
   * @return An observable that emits when the operation completes.
   */
  testMessage(sendMessageReq: SendMessageRequest): Observable<void> {
    const url = `${this.url}/test-message`;
    return this._httpClient.post(url, sendMessageReq, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<void>({ successMessage: 'Test Message Successfully Sent' })
    );
  }
}
