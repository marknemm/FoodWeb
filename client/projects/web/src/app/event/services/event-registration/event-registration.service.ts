import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '~web/environment';
import { ErrorHandlerService } from '~web/error-handler/error-handler.service';
import { EventRegistration, EventRegistrationRequest, ListResponse } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {

  readonly url = `${environment.server}/event/registration`;

  private _loading = false;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  signup(eventTitle: string, eventDateTime: string, eventRegistration: Partial<EventRegistration>): Observable<any> {
    eventRegistration.eventTitleDate = `${eventTitle} - ${eventDateTime}`;
    const eventRegistrationReq: EventRegistrationRequest = { eventRegistration: <EventRegistration>eventRegistration };
    this._loading = true;
    return this._httpClient.post(this.url, eventRegistrationReq, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._loading = false)
    );
  }

  getEventRegistrations(): Observable<ListResponse<EventRegistration>> {
    return this._httpClient.get<ListResponse<EventRegistration>>(this.url, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._loading = false)
    );
  }
}
