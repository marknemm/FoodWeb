import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~admin-env/environment';
import { FeaturedEvent, FeaturedEventCreateRequest } from '~shared';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class EventCreateService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  /**
   * Creates a new featured event (saves it to the server).
   * @param featuredEvent The featured event to create.
   * @return An observable that emits the newly created (saved) feature event.
   */
  createEvent(featuredEvent: FeaturedEvent): Observable<FeaturedEvent> {
    const request: FeaturedEventCreateRequest = { featuredEvent };
    return this._httpClient.post<FeaturedEvent>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(this.createEvent, { successMessage: 'Event Creation Successful' })
    );
  }
}
