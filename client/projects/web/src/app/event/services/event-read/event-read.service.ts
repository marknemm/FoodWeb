import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { environment } from '~web-env/environment';
import { FeaturedEvent, FeaturedEventRequest, ListResponse } from '~shared';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
export { FeaturedEvent };

@Injectable({
  providedIn: 'root'
})
export class EventReadService {

  readonly apiUrl = `${environment.server}/featured-event`;

  private _loading = false;

  constructor(
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService
  ) {}

  /**
   * Whether or not the featured events are loading.
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * Gets the next (nearest) upcoming featured event.
   * @return An observable the emits the next upcoming event. Emits null/undefined if one does not exist.
   */
  getNextEvent(): Observable<FeaturedEvent> {
    const request: FeaturedEventRequest = { sortBy: 'date', sortOrder: 'ASC', page: 1, limit: 1 };
    return this._getEvents(request, false).pipe(
      map((featuredEvents: FeaturedEvent[]) => featuredEvents[0])
    );
  }

  /**
   * Gets all upcoming featured events.
   * @param triggerPageProgress Whether or not to trigger page progress during load. Defaults to true.
   * @return An observable that emits a list of all of the upcoming featured events. Emits an empty array if there are none.
   */
  getEvents(triggerPageProgress = true): Observable<FeaturedEvent[]> {
    return this._getEvents(undefined, triggerPageProgress);
  }

  /**
   * Gets all upcoming featured events.
   * @param request An optional custom request.
   * @param triggerPageProgress Whether or not to trigger page progress during load.
   * @return An observable that emits a list of all of the upcoming featured events. Emits an empty array if there are none.
   */
  private _getEvents(request: FeaturedEventRequest = { sortBy: 'date', sortOrder: 'ASC' }, triggerPageProgress: boolean): Observable<FeaturedEvent[]> {
    const params = new HttpParams({ fromObject: <any>request });
    this._loading = true;
    if (triggerPageProgress) {
      this._pageProgressService.activate(true);
    }
    return this._httpClient.get<ListResponse<FeaturedEvent>>(this.apiUrl, { withCredentials: true, params }).pipe(
      map((response: ListResponse<FeaturedEvent>) => response.list),
      finalize(() => {
        this._loading = false;
        this._pageProgressService.deactivate();
      })
    );
  }
}
