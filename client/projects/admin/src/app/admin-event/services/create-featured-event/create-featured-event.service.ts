import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from '~admin/environments/environment';
import { FeaturedEvent, FeaturedEventCreateRequest } from '~shared';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class CreateFeaturedEventService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _alertSerivce: AlertService,
    private _errorHandlerService: ErrorHandlerService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService
  ) {}

  /**
   * Creates a new featured event (saves it to the server).
   * @param featuredEvent The featured event to create.
   * @return An observable that emits the newly created (saved) feature event.
   */
  createEvent(featuredEvent: FeaturedEvent): Observable<FeaturedEvent> {
    const request: FeaturedEventCreateRequest = { featuredEvent };
    this._pageProgressService.activate(true);
    return this._httpClient.post<FeaturedEvent>(this.url, request, { withCredentials: true })
      .pipe(
        map(this._showSuccessMessage.bind(this)),
        catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
        finalize(() => this._pageProgressService.reset())
      );
  }

  /**
   * Displays a success message for a newly created featured event.
   * @param featuredEvent The featured event to show the success message for.
   * @return The input featured event.
   */
  private _showSuccessMessage(featuredEvent: FeaturedEvent): FeaturedEvent {
    this._alertSerivce.displaySimpleMessage('Event Creation Successful', 'success');
    return featuredEvent;
  }
}
