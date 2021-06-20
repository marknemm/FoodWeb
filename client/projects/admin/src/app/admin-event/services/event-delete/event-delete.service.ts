import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '~admin-env/environment';
import { FeaturedEvent } from '~shared';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class EventDeleteService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _alertSerivce: AlertService,
    private _alertQueueService: AlertQueueService,
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
        catchError((err: HttpErrorResponse) => this._alertQueueService.add(err)),
        finalize(() => this._pageProgressService.reset())
      );
  }
}
