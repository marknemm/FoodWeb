import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '~admin/environments/environment';
import { FeaturedEvent } from '~shared';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteFeaturedEventService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _alertSerivce: AlertService,
    private _errorHandlerService: ErrorHandlerService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService
  ) {}

  /**
   * Deletes a given featured event (on the server).
   * @param featuredEvent The featured event to delete.
   * @return An observable that emits once the event has been deleted.
   */
  deleteEvent(featuredEvent: FeaturedEvent): Observable<void> {
    this._pageProgressService.activate(true);
    return this._httpClient.delete<void>(`${this.url}/${featuredEvent.id}`, { withCredentials: true })
      .pipe(
        tap(() => this._alertSerivce.displaySimpleMessage('Event Deletion Successful', 'success')),
        catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
        finalize(() => this._pageProgressService.reset())
      );
  }
}
