import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '~admin/envrionments/environment';
import { EventRegistration, FeaturedEvent } from '~shared';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationsService {

  readonly eventsUrl = `${environment.server}/featured-event`;
  readonly eventIdentifiersUrl = `${this.eventsUrl}/identifiers`;
  readonly eventRegistrationsUrlTmpl = `${this.eventsUrl}/:id/registrations`;

  private _eventRegistrationsLoading = false;
  private _eventsLoading = false;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  get eventRegistrationsLoading(): boolean {
    return this._eventRegistrationsLoading;
  }

  get eventsLoading(): boolean {
    return this._eventsLoading;
  }

  getEventIdentifiers(): Observable<Partial<FeaturedEvent>[]> {
    this._eventsLoading = true;
    return this._httpClient.get<Partial<FeaturedEvent>[]>(this.eventIdentifiersUrl, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._eventsLoading )
    )
  }

  getEventRegistrations(eventIdentifiersStr: string): Observable<EventRegistration[]> {
    const featuredEventIdStr: string = eventIdentifiersStr.split(':')[0];
    const eventRegistrationsUrl: string = this.eventRegistrationsUrlTmpl.replace(':id', featuredEventIdStr);
    this._eventRegistrationsLoading = true;
    return this._httpClient.get<EventRegistration[]>(eventRegistrationsUrl, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._eventRegistrationsLoading = false)
    );
  }
}
