import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DonationHubPledge, DonationHubPledgeReadRequest, ListResponse } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseHandlerOptions, HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DonationHubPledgeReadService {

  /**
   * The REST endpoint URL for a donation hub resource.
   */
  readonly url = `${environment.server}/donation-hub/pledge`;

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
   * Checks if a given method within this service is loading its HTTP response.
   * @param loadingFn The method within this service to check.
   * @return true if loading, false if not.
   */
  isLoading(loadingFn: any): boolean {
    return this._httpResponseService.isLoading(loadingFn);
  }

  /**
   * Gets a single donation hub pledge from the server based off of a given donation hub pledge ID.
   * @param id The ID of the donation hub pledge to retrieve.
   * @return An observable that emits the retrieved donation hub pledge.
   */
  getDonationHubPledge(id: number): Observable<DonationHubPledge> {
    const readUrl = `${this.url}/${id}`;
    return this._httpClient.get<DonationHubPledge>(readUrl, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ loadingId: this.getDonationHubPledge })
    );
  }

  /**
   * Gets a list of donation hubs from the server based off of a given donation hub read request.
   * If it is detected that the user is on a `/my` route, then their donation hubs will be retrieved.
   * @param request The donation hub read request containing filter, pagination, and sorting parameters for the retrieval.
   * @return An observable that emits a list response containing the retrieved donation hubs.
   */
  getDonationHubPledges(
    request: DonationHubPledgeReadRequest,
    opts: HttpResponseHandlerOptions<ListResponse<DonationHubPledge>> = {}
  ): Observable<ListResponse<DonationHubPledge>> {
    const myPledges: boolean = (this._router.url.indexOf('my') >= 0);
    opts.loadingId = this.getDonationHubPledges;
    return this._getDonationHubPledges(request, opts, myPledges);
  }

  /**
   * Gets a list of the user's donation hubs from the server based off of a given donation hub read request.
   * @param request The donation hub read request containing filter, pagination, and sorting parameters for the retrieval.
   * @return An observable that emits a list response containing the retrieved donation hubs belonging to the current user.
   */
  getMyDonationHubPledges(
    request: DonationHubPledgeReadRequest,
    opts: HttpResponseHandlerOptions<ListResponse<DonationHubPledge>> = {}
  ): Observable<ListResponse<DonationHubPledge>> {
    opts.loadingId = this.getMyDonationHubPledges;
    return this._getDonationHubPledges(request, opts, true);
  }

  /**
   * Gets donation hub pledges form the server based off of a given donation hub read request.
   * @param request The donation hub pledge read request.
   * @param opts The optional HTTP response handler options.
   * @return An observable that emits the donation hub pledge list response from the server.
   */
  private _getDonationHubPledges(
    request: DonationHubPledgeReadRequest = {},
    opts: HttpResponseHandlerOptions<ListResponse<DonationHubPledge>>,
    myPledges: boolean
  ): Observable<ListResponse<DonationHubPledge>> {
    const readUrl: string = this.url + (myPledges ? '/my' : '');
    request.page = request.page ? request.page : 1;
    request.limit = request.limit ? request.limit : Number.MAX_SAFE_INTEGER;
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<DonationHubPledge>>(readUrl, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(opts)
    );
  }

  /**
   * Gets donation hub pledges that fall under a given donation hub form the server.
   * @param donationHubId The ID of the donation that the pledge belongs to.
   * @param request The donation hub pledge read request.
   * @param opts The optional HTTP response handler options.
   * @return An observable that emits the donation hub pledge list response from the server.
   */
  getPledgesUnderDonationHub(
    donationHubId: number,
    request: DonationHubPledgeReadRequest = {},
    opts: HttpResponseHandlerOptions<ListResponse<DonationHubPledge>> = {}
  ): Observable<ListResponse<DonationHubPledge>> {
    const readUrl = this._insertDonationHubIdIntoUrl(donationHubId);
    request.page = request.page ? request.page : 1;
    request.limit = request.limit ? request.limit : Number.MAX_SAFE_INTEGER;
    const params = new HttpParams({ fromObject: <any>request });
    opts.loadingId = this.getPledgesUnderDonationHub;
    return this._httpClient.get<ListResponse<DonationHubPledge>>(readUrl, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(opts)
    );
  }

  /**
   * Gets the donation pledge belonging to the current user, which falls under a given donation hub.
   * @param donationHubId The ID of the donation hub that the donation pledge is to be under.
   * @param opts The optional HTTP response handler options.
   * @return An observable that emits the donation hub pledge response from the server.
   */
  getMyPledgeUnderDonationHub(
    donationHubId: number,
    opts: HttpResponseHandlerOptions<DonationHubPledge> = {}
  ): Observable<DonationHubPledge> {
    const readUrl = `${this._insertDonationHubIdIntoUrl(donationHubId)}/my`;
    opts.loadingId = this.getMyPledgeUnderDonationHub;
    return this._httpClient.get<DonationHubPledge>(readUrl, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(opts)
    );
  }

  /**
   * Inserts a given donation hub ID into this service's URL.
   * @param donationHubId The donation hub ID that is to be inserted into the URL.
   * @return The URL with donation hub ID inserted.
   */
  private _insertDonationHubIdIntoUrl(donationHubId: number): string {
    return this.url.replace('/pledge', `/${donationHubId}/pledge`);
  }
}
