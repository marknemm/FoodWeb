import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DonationHub, DonationHubReadRequest, ListResponse } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseHandlerOptions, HttpResponseService } from '~web/shared/services/http-response/http-response.service';

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
    private _httpResponseService: HttpResponseService,
    private _router: Router
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
   * Gets a list of donation hubs from the server based off of a given donation hub read request.
   * If it is detected that the user is on a `/my` route, then their donation hubs will be retrieved.
   * @param request The donation hub read request containing filter, pagination, and sorting parameters for the retrieval.
   * @param opts Options for the HTTP response handler.
   * @return An observable that emits a list response containing the retrieved donation hubs.
   */
  getDonationHubs(request: DonationHubReadRequest, opts: HttpResponseHandlerOptions = {}): Observable<ListResponse<DonationHub>> {
    const myDonationHubs: boolean = (this._router.url.indexOf('my') >= 0);
    return this._getDonationHubs(request, myDonationHubs, opts);
  }

  /**
   * Gets a list of the user's donation hubs from the server based off of a given donation hub read request.
   * @param request The donation hub read request containing filter, pagination, and sorting parameters for the retrieval.
   * @param opts Options for the HTTP response handler.
   * @return An observable that emits a list response containing the retrieved donation hubs belonging to the current user.
   */
  getMyDonationHubs(request: DonationHubReadRequest, opts: HttpResponseHandlerOptions = {}): Observable<ListResponse<DonationHub>> {
    return this._getDonationHubs(request, true, opts);
  }

  /**
   * Gets donation hubs form the server based off of a given donation hub read request.
   * @param request The donation hub read request.
   * @param myDonationHubs Whether or not to retrieve donation hubs that only belong to the current user.
   * @param opts Options for the HTTP response handler.
   * @return An observable that emits the donation hub list response from the server.
   */
  _getDonationHubs(
    request: DonationHubReadRequest,
    myDonationHubs: boolean,
    opts: HttpResponseHandlerOptions
  ): Observable<ListResponse<DonationHub>> {
    const readUrl = this.url + (myDonationHubs ? '/my' : '');
    request.page = request.page ? request.page : 1;
    request.limit = request.limit ? request.limit : 10;
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<DonationHub>>(readUrl, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(opts)
    );
  }
}
