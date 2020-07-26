import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { EventRegistration, EventRegistrationCreateRequest, FeaturedEvent } from '~shared';
import { environment } from '~web/../environments/environment';
import { ErrorHandlerService } from '~web/shared/services/error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterEventService {

  readonly url = `${environment.server}/featured-event/registration`;

  private _loading = false;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  register(event: FeaturedEvent, eventRegistration: Partial<EventRegistration>): Observable<any> {
    eventRegistration.featuredEvent = event;
    const eventRegistrationReq: EventRegistrationCreateRequest = { eventRegistration: <EventRegistration>eventRegistration };
    this._loading = true;
    return this._httpClient.post(this.url, eventRegistrationReq, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._loading = false)
    );
  }
}
