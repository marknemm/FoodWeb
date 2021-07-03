import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '~admin-env/environment';
import { FeaturedEvent } from '~shared';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
export { FeaturedEvent };

@Injectable({
  providedIn: 'root'
})
export class EventReadService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _window: Window,
  ) {}

  listenEventQueryChange(activatedRoute: ActivatedRoute): Observable<FeaturedEvent> {
    return activatedRoute.paramMap.pipe(
      switchMap((paramMap: ParamMap) => {
        const id: number = (paramMap.has('id') ? parseInt(paramMap.get('id'), 10) : undefined);
        return this.findEvent(id);
      })
    );
  }

  findEvent(id: number): Observable<FeaturedEvent> {
    // Attempt to get featured event from window state history.
    if (this._window.history.state?.featuredEvent?.id === id) {
      return of(this._window.history.state.featuredEvent);
    }
    // Get featured event from server.
    const url = `${this.url}/${id}`;
    return this._httpClient.get<FeaturedEvent>(url, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

}
