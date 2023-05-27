import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class UsernameRecoveryService {

  readonly url = `${environment.server}/account/recover-username`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  get loading(): boolean {
    return this._httpResponseService.anyLoading(this);
  }

  sendUsernameRecoveryEmail(email: string): Observable<void> {
    const params = (new HttpParams()).set('email', email);
    return this._httpClient.get<void>(this.url, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<void>(this.sendUsernameRecoveryEmail, { loaderBlocking: false })
    );
  }
}
