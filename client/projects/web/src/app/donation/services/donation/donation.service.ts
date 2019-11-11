import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, flatMap } from 'rxjs/operators';
import { environment } from '~web-env/environment';
import { PageProgressService, ErrorHandlerService, AlertService } from '~web/shared';
import {
  Donation,
  DonationCreateRequest,
  DonationUpdateRequest,
  DonationClaimRequest,
  DonationReadFilters,
  DonationReadRequest,
  ListResponse
} from '~shared';
export { Donation };

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  /**
   * The REST endpoint URL for a donation resource.
   */
  readonly url = `${environment.server}/donation`;

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _pageProgressService: PageProgressService,
    private _errorHandlerService: ErrorHandlerService,
    private _alertService: AlertService
  ) {}

  /**
   * Creates (saves) a new donation on the server.
   * @param donation The donation to create on the server.
   * @return An observable that emits the newly saved donation when the server response returns.
   */
  createDonation(donation: Donation): Observable<Donation> {
    const createRequest: DonationCreateRequest = { donation };
    this._pageProgressService.activate(true);
    return this._httpClient.post<Donation>(this.url, createRequest, { withCredentials: true }).pipe(
      map((savedDonation: Donation) => {
        this._alertService.displaySimpleMessage('Donation successful', 'success');
        return savedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  updateDonation(originalDonation: Donation, donationSectionUpdate: Partial<Donation>): Observable<Donation> {
    const updateRequest: DonationUpdateRequest = this._genDonationUpdateRequest(originalDonation, donationSectionUpdate);
    this._pageProgressService.activate(true);
    return this._httpClient.put<Donation>(this.url, updateRequest, { withCredentials: true }).pipe(
      map((savedDonation: Donation) => {
        this._alertService.displaySimpleMessage('Donation update successful', 'success');
        return savedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  private _genDonationUpdateRequest(originalDonation: Donation, donationSectionUpdate: Partial<Donation>): DonationUpdateRequest {
    const donation: Donation = Object.assign({}, originalDonation);
    Object.keys(donationSectionUpdate).forEach((property: string) => donation[property] = donationSectionUpdate[property]);
    return { donation };
  }

  deleteDonation(donation: Donation): Observable<void> {
    const deleteUrl = `${this.url}/${donation.id}`;
    this._pageProgressService.activate(true);
    return this._httpClient.delete(deleteUrl, { withCredentials: true }).pipe(
      map(() => this._alertService.displaySimpleMessage('Donation deletion successful', 'success')),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  claimDonation(donation: Donation): Observable<Donation> {
    const claimUrl = `${this.url}/claim`;
    const request: DonationClaimRequest = { donationId: donation.id };
    this._pageProgressService.activate(true);
    return this._httpClient.post<Donation>(claimUrl, request, { withCredentials: true }).pipe(
      map((claimedDonation: Donation) => {
        this._alertService.displaySimpleMessage('Donation successfully claimed', 'success');
        return claimedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  unclaimDonation(donation: Donation): Observable<Donation> {
    const unclaimUrl = `${this.url}/claim/${donation.id}`;
    this._pageProgressService.activate(true);
    return this._httpClient.delete<Donation>(unclaimUrl, { withCredentials: true }).pipe(
      map((unclaimedDonation: Donation) => {
        this._alertService.displaySimpleMessage('Donation successfully unclaimed', 'success');
        return unclaimedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
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
    if (window.history.state && window.history.state.id === id) {
      return of(window.history.state);
    }
    // Get donation from server.
    const url = `${this.url}/${id}`;
    this._pageProgressService.activate(true);
    return this._httpClient.get<Donation>(url, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  listenDonationsQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Donation>> {
    const myDonations: boolean = (this._router.url.indexOf('my') >= 0);
    return activatedRoute.queryParamMap.pipe(
      flatMap((params: ParamMap) => {
        const filters: DonationReadFilters = {};
        params.keys.forEach((paramKey: string) => {
          if (paramKey !== 'page' && paramKey !== 'limit') {
            filters[paramKey] = params.get(paramKey);
          }
        });
        const page: number = (params.has('page') ? parseInt(params.get('page'), 10) : undefined);
        const limit: number = (params.has('limit') ? parseInt(params.get('limit'), 10) : undefined);
        return this._getDonations(filters, page, limit, myDonations);
      })
    );
  }

  getMyDonations(filters: DonationReadFilters, page = 1, limit = 10): Observable<ListResponse<Donation>> {
    return this._getDonations(filters, page, limit, true);
  }

  getDonations(filters: DonationReadFilters, page = 1, limit = 10): Observable<ListResponse<Donation>> {
    return this._getDonations(filters, page, limit, false);
  }

  private _getDonations(filters: DonationReadFilters, page: number, limit: number, myDonations: boolean): Observable<ListResponse<Donation>> {
    const getUrl: string = this.url + (myDonations ? '/my' : '');
    const request = <DonationReadRequest>filters;
    if (page >= 0) {
      request.page = page;
    }
    if (limit >= 0) {
      request.limit = limit;
    }
    const params = new HttpParams({ fromObject: <any>request });
    this._pageProgressService.activate(true);
    return this._httpClient.get<ListResponse<Donation>>(getUrl, { params, withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
