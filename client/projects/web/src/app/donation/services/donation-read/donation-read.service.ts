import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Donation, DonationReadRequest, ListResponse } from '~shared';
import { environment } from '~web/environments/environment';
import { HttpResponseService } from '~web/shared/http-response/http-response.service';
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

  listenDonationsQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Donation>> {
    const myDonations: boolean = (this._router.url.indexOf('my') >= 0);
    return activatedRoute.queryParamMap.pipe(
      flatMap((params: ParamMap) => {
        const request: DonationReadRequest = {
          page: (params.has('page') ? parseInt(params.get('page'), 10) : 1),
          limit: (params.has('limit') ? parseInt(params.get('limit'), 10) : 10)
        };
        params.keys.forEach((paramKey: string) => {
          if (paramKey !== 'page' && paramKey !== 'limit') {
            (<any>request)[paramKey] = params.get(paramKey);
          }
        });
        return this._getDonations(request, myDonations);
      })
    );
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
