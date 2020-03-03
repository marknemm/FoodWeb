import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from '~admin/environments/environment';
import { FeaturedEvent, FeaturedEventUpdateRequest } from '~shared';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateFeaturedEventService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _alertSerivce: AlertService,
    private _errorHandlerService: ErrorHandlerService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService
  ) {}

  /**
   * Updates a new featured event (saves it to the server).
   * @param featuredEvent The featured event to update (with included changes).
   * @return An observable that emits the saved feature event.
   */
  updateEvent(featuredEvent: FeaturedEvent): Observable<FeaturedEvent> {
    const request: FeaturedEventUpdateRequest = { featuredEvent };
    this._pageProgressService.activate(true);
    return this._httpClient.put<FeaturedEvent>(`${this.url}/${featuredEvent.id}`, request, { withCredentials: true })
      .pipe(
        map(this._showSuccessMessage.bind(this)),
        catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
        finalize(() => this._pageProgressService.reset())
      );
  }

  /**
   * Displays a success message for the update of a featured event.
   * @param featuredEvent The featured event to show the success message for.
   * @return The input featured event.
   */
  private _showSuccessMessage(featuredEvent: FeaturedEvent): FeaturedEvent {
    this._alertSerivce.displaySimpleMessage('Event Update Successful', 'success');
    return featuredEvent;
  }
}
