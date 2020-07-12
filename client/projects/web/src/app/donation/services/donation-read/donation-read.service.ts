import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, Params } from '@angular/router';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Donation, DonationReadRequest, ListResponse } from '~shared';
import { environment } from '~web/environments/environment';
import { HttpResponseService } from '~web/shared/http-response/http-response.service';
import { cloneDeep } from 'lodash-es';
export { Donation };

@Injectable({
  providedIn: 'root'
})
export class DonationReadService {

  /**
   * The REST endpoint URL for a donation resource.
   */
  readonly url = `${environment.server}/donation`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _router: Router
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

  listenDonationQueryChange(activatedRoute: ActivatedRoute): Observable<Donation> {
    return activatedRoute.paramMap.pipe(
      flatMap((paramMap: ParamMap) => {
        const id: number = (paramMap.has('id') ? parseInt(paramMap.get('id'), 10) : undefined);
        return this.getDonation(id);
      })
    );
  }

  getDonation(id: number): Observable<Donation> {
    // Attempt to get donation from window state history.
    if ( window.history.state?.donation?.id === id) {
      return of(window.history.state.donation);
    }
    // Get donation from server.
    const url = `${this.url}/${id}`;
    return this._httpClient.get<Donation>(url, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

  handleDonationsQueryChange(params: Params): Observable<ListResponse<Donation>> {
    const myDonations: boolean = (this._router.url.indexOf('my') >= 0);
    const request: DonationReadRequest = cloneDeep(params);
    request.page = (params.page ? parseInt(params.page, 10) : 1);
    request.limit = (params.limit ? parseInt(params.limit, 10) : 10);
    return this._getDonations(request, myDonations);
  }

  getMyDonations(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    return this._getDonations(request, true);
  }

  getDonations(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    return this._getDonations(request, false);
  }

  private _getDonations(request: DonationReadRequest, myDonations: boolean): Observable<ListResponse<Donation>> {
    const getUrl: string = this.url + (myDonations ? '/my' : '');
    request.page = request.page ? request.page : 1;
    request.limit = request.limit ? request.limit : 10;
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Donation>>(getUrl, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }
}
