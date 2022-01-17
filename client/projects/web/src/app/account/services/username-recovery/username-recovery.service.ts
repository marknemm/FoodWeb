import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class UsernameRecoveryService {

  readonly url = `${environment.server}/account/recover-username`;

  private _loading = false;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  sendUsernameRecoveryEmail(email: string): Observable<void> {
    const params = (new HttpParams()).set('email', email);
    this._loading = true;
    return this._httpClient.get<void>(this.url, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<void>({ loaderBlocking: false }),
      finalize(() => this._loading = false)
    );
  }
}
