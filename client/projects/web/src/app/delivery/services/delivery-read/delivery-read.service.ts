import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
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

  updateURLQueryString(filters: DonationReadRequest, activatedRoute: ActivatedRoute): void {
    // Convert dates into raw ISO strings.
    for (const filtKey in filters) {
      if (filters[filtKey] instanceof Date) {
        filters[filtKey] = (<Date>filters[filtKey]).toISOString();
      }
    }

    this._router.navigate([], {
      relativeTo: activatedRoute,
      queryParams: filters
    });
  }

  handleDeliveriesQueryChange(params: Params): Observable<ListResponse<Donation>> {
    const filters: DonationReadRequest = _.cloneDeep(params);
    filters.page = (params.page ? parseInt(params.page, 10) : 1);
    filters.limit = (params.limit ? parseInt(params.limit, 10) : 10);

    return (this._router.url.indexOf('my') >= 0)
      ? this.getMyDeliveries(filters)
      : (this._router.url.indexOf('unscheduled') >= 0)
        ? this.getUnscheduledDeliveries(filters)
        : this._getDeliveries(filters);
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