import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, flatMap } from 'rxjs/operators';
import { environment } from '~admin/environments/environment';
import { FeaturedEvent } from '~shared';
import { ErrorHandlerService } from '~web/shared/services/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
export { FeaturedEvent };

@Injectable({
  providedIn: 'root'
})
export class ReadFeaturedEventService {

  readonly url = `${environment.server}/featured-event`;

  constructor(
    private _errorHandlerService: ErrorHandlerService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService
  ) {}

  listenFeaturedEventQueryChange(activatedRoute: ActivatedRoute): Observable<FeaturedEvent> {
    return activatedRoute.paramMap.pipe(
      flatMap((paramMap: ParamMap) => {
        const id: number = (paramMap.has('id') ? parseInt(paramMap.get('id'), 10) : undefined);
        return this.findFeaturedEvent(id);
      })
    );
  }

  findFeaturedEvent(id: number): Observable<FeaturedEvent> {
    // Attempt to get featured event from window state history.
    if (window.history.state?.featuredEvent?.id === id) {
      return of(window.history.state.featuredEvent);
    }
    // Get featured event from server.
    const url = `${this.url}/${id}`;
    this._pageProgressService.activate(true);
    return this._httpClient.get<FeaturedEvent>(url, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

}
