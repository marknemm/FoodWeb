import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~admin-env/environment';
import { FeaturedEvent, FeaturedEventUpdateRequest } from '~shared';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class EventUpdateService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
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
    return this._httpClient.put<FeaturedEvent>(`${this.url}/${featuredEvent.id}`, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Event Update Successful' })
    );
  }
}
