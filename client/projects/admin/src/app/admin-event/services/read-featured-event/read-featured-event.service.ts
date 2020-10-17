import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '~admin-env/environment';
import { FeaturedEvent } from '~shared';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
export { FeaturedEvent };

@Injectable({
  providedIn: 'root'
})
export class ReadFeaturedEventService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _alertQueueService: AlertQueueService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService,
    private _window: Window,
  ) {}

  listenFeaturedEventQueryChange(activatedRoute: ActivatedRoute): Observable<FeaturedEvent> {
    return activatedRoute.paramMap.pipe(
      switchMap((paramMap: ParamMap) => {
        const id: number = (paramMap.has('id') ? parseInt(paramMap.get('id'), 10) : undefined);
        return this.findFeaturedEvent(id);
      })
    );
  }

  findFeaturedEvent(id: number): Observable<FeaturedEvent> {
    // Attempt to get featured event from window state history.
    if (this._window.history.state?.featuredEvent?.id === id) {
      return of(this._window.history.state.featuredEvent);
    }
    // Get featured event from server.
    const url = `${this.url}/${id}`;
    this._pageProgressService.activate(true);
    return this._httpClient.get<FeaturedEvent>(url, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._alertQueueService.add(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

}
