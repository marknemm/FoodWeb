import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~admin-env/environment';
import { FeaturedEvent } from '~shared';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class EventDeleteService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  /**
   * Deletes a given featured event (on the server).
   * @param featuredEvent The featured event to delete.
   * @return An observable that emits once the event has been deleted.
   */
  deleteEvent(featuredEvent: FeaturedEvent): Observable<void> {
    return this._httpClient.delete<void>(`${this.url}/${featuredEvent.id}`, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Event Deletion Successful' })
    );
  }
}
