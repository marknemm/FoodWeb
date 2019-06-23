import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, flatMap } from 'rxjs/operators';
import { PageProgressService } from '../page-progress/page-progress.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { AlertService } from '../alert/alert.service';
import { Donation } from '../../../../../shared/src/interfaces/donation/donation';
import { DonationReadRequest, DonationReadFilters } from '../../../../../shared/src/interfaces/donation/donation-read-request';
import { DonationClaimRequest } from '../../../../../shared/src/interfaces/donation/donation-claim-request';
import { ListResponse } from '../../../../../shared/src/interfaces/list-response';
export { Donation };

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  /**
   * The REST endpoint URL for a donation resource.
   */
  readonly url = '/server/donation';

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
    this._pageProgressService.activate(true);
    return this._httpClient.post<Donation>(this.url, donation).pipe(
      map((savedDonation: Donation) => {
        this._alertService.displaySimpleMessage('Donation successful', 'success');
        return savedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  updateDonation(originalDonation: Donation, donationSectionUpdate: Partial<Donation>): Observable<Donation> {
    const donationUpdate: Donation = this._genDonationUpdate(originalDonation, donationSectionUpdate);
    this._pageProgressService.activate(true);
    return this._httpClient.put<Donation>(this.url, donationUpdate).pipe(
      map((savedDonation: Donation) => {
        this._alertService.displaySimpleMessage('Donation update successful', 'success');
        return savedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  deleteDonation(donation: Donation): Observable<void> {
    const deleteUrl = `${this.url}/${donation.id}`;
    this._pageProgressService.activate(true);
    return this._httpClient.delete(deleteUrl).pipe(
      map(() => this._alertService.displaySimpleMessage('Donation deletion successful', 'success')),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  private _genDonationUpdate(originalDonation: Donation, donationSectionUpdate: Partial<Donation>): Donation {
    const donation: Donation = Object.assign({}, originalDonation);
    Object.keys(donationSectionUpdate).forEach((property: string) => donation[property] = donationSectionUpdate[property]);
    return donation;
  }

  claimDonation(donation: Donation): Observable<Donation> {
    const claimUrl = `${this.url}/claim`;
    const request: DonationClaimRequest = { donationId: donation.id };
    this._pageProgressService.activate(true);
    return this._httpClient.post<Donation>(claimUrl, request).pipe(
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
    return this._httpClient.delete<Donation>(unclaimUrl).pipe(
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
    return this._httpClient.get<Donation>(url).pipe(
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
    return this._httpClient.get<ListResponse<Donation>>(getUrl, { params }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
