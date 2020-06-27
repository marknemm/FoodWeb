import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, finalize, flatMap } from 'rxjs/operators';
import { Donation, DonationReadRequest, ListResponse } from '~shared';
import { environment } from '~web/environments/environment';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryReadService {

  /**
   * The REST endpoint URL for a delivery resource.
   */
  readonly url = `${environment.server}/delivery`;

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _pageProgressService: PageProgressService,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  listenDeliveriesQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Donation>> {
    return activatedRoute.queryParamMap.pipe(
      flatMap((params: ParamMap) => {
        const filters: DonationReadRequest = {
          page: (params.has('page') ? parseInt(params.get('page'), 10) : 1),
          limit: (params.has('limit') ? parseInt(params.get('limit'), 10) : 10)
        };
        params.keys.forEach((paramKey: string) => {
          if (paramKey !== 'page' && paramKey !== 'limit') {
            filters[paramKey] = params.get(paramKey);
          }
        });
        return (this._router.url.indexOf('my') >= 0)
          ? this.getMyDeliveries(filters)
          : (this._router.url.indexOf('unscheduled') >= 0)
          ? this.getUnscheduledDeliveries(filters)
          : this._getDeliveries(filters);
      })
    );
  }

  getMyDeliveries(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    return this._getDeliveries(request, '/my');
  }

  getUnscheduledDeliveries(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    return this._getDeliveries(request, '/unscheduled');
  }

  private _getDeliveries(request: DonationReadRequest, subRoute = ''): Observable<ListResponse<Donation>> {
    const getUrl: string = (this.url + subRoute);
    request.page = request.page ? request.page : 1;
    request.limit = request.limit ? request.limit : 10;
    const params = new HttpParams({ fromObject: <any>request });
    this._pageProgressService.activate(true);
    return this._httpClient.get<ListResponse<Donation>>(getUrl, { params, withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
