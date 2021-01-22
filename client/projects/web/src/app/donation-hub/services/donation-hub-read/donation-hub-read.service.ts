import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';
import { DonationHub, DonationHubReadRequest, ListResponse } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

/**
 * A service for reading donation hub data from the server.
 */
@Injectable({
  providedIn: 'root'
})
export class DonationHubReadService {

  /**
   * The REST endpoint URL for a donation hub resource.
   */
  readonly url = `${environment.server}/donation-hub`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  /**
   * Whether or not a donation hub read request is loading.
   */
  get loading(): boolean {
    return this._httpResponseService.loading;
  }

  /**
   * Gets a single donation hub from the server based off of a given donation hub ID.
   * @param id The ID of the donation hub to retrieve.
   * @return An observable that emits the retrieved donation hub.
   */
  getDonationHub(id: number): Observable<DonationHub> {
    const url = `${this.url}/${id}`;
    return this._httpClient.get<DonationHub>(url, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

  /**
   * Gets donation hubs form the server based off of a given donation hub read request.
   * @param request The donation hub read request.
   * @return An observable that emits the donation hub list response from the server.
   */
  getDonationHubs(request: DonationHubReadRequest): Observable<ListResponse<DonationHub>> {
    request.page = request.page ? request.page : 1;
    request.limit = request.limit ? request.limit : 10;
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<DonationHub>>(this.url, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }
}
