import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '~web/../environments/environment';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';

@Injectable({
  providedIn: 'root'
})
export class UsernameRecoveryService {

  readonly url = `${environment.server}/account/recover-username`;

  private _loading = false;

  constructor(
    private _httpClient: HttpClient,
    private _alertQueueService: AlertQueueService
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  sendUsernameRecoveryEmail(email: string): Observable<void> {
    const params = (new HttpParams()).set('email', email);
    this._loading = true;
    return this._httpClient.get<void>(this.url, { params, withCredentials: true }).pipe(
      catchError((err: any) => this._alertQueueService.add(err)),
      finalize(() => this._loading = false)
    );
  }
}
