import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Donation, DonationReadRequest, ListResponse } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
export { Donation };

/**
 * A service responsible for reading donations from the server.
 */
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
    private _router: Router,
    private _window: Window,
  ) {}

  /**
   * Whether or not a donation read request is loading.
   */
  get loading(): boolean {
    return this._httpResponseService.loading;
  }

  /**
   * Gets a single donation from the server based off of a given donation ID.
   * @param id The ID of the donation to retrieve.
   * @return An observable that emits the retrieved donation.
   */
  getDonation(id: number): Observable<Donation> {
    // Attempt to get donation from window state history.
    if (this._window.history.state?.donation?.id === id) {
      return of(this._window.history.state.donation);
    }
    // Get donation from server.
    const url = `${this.url}/${id}`;
    return this._httpClient.get<Donation>(url, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

  /**
   * Gets a list of donations from the server based off of a given donation read request.
   * If it is detected that the user is on a `/my` route, then their donations will be retrieved.
   * @param request The donation read request containing filter, pagination, and sorting parameters for the retrieval.
   * @return An observable that emits a list response containing the retrieved donations.
   */
  getDonations(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    const myDonations: boolean = (this._router.url.indexOf('my') >= 0);
    return this._getDonations(request, myDonations);
  }

  /**
   * Gets a list of the user's donations from the server based off of a given donation read request.
   * @param request The donation read request containing filter, pagination, and sorting parameters for the retrieval.
   * @return An observable that emits a list response containing the retrieved donations belonging to the current user.
   */
  getMyDonations(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    return this._getDonations(request, true);
  }

  /**
   * Gets a list of donations from the server based off of a given donation read request.
   * @param request The donation read request containing filter, pagination, and sorting parameters for the retrieval.
   * @param myDonations Whether or not to retrieve donations that only belong to the current user.
   * @return An observable that emits a list response containing the retrieved donations.
   */
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
