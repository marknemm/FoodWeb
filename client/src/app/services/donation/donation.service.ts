import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, flatMap } from 'rxjs/operators';
import { PageProgressService } from '../page-progress/page-progress.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { AlertService } from '../alert/alert.service';
import { DonationCreateRequest, Donation } from '../../../../../shared/src/interfaces/donation/donation-create-request';
import { DonationReadRequest, DonationReadFilters } from '../../../../../shared/src/interfaces/donation/donation-read-request';
import { DonationUpdateRequest } from '../../../../../shared/src/interfaces/donation/donation-update-request';
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
    const request: DonationCreateRequest = { donation };
    this._pageProgressService.activate(true);
    return this._httpClient.post<Donation>(this.url, request).pipe(
      map((savedDonation: Donation) => {
        this._alertService.displaySimpleMessage('Donation successful', 'success');
        return savedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  updateDonation(originalDonation: Donation, donationUpdate: Partial<Donation>): Observable<Donation> {
    const request: DonationUpdateRequest = this._genDonationUpdateRequest(originalDonation, donationUpdate);
    this._pageProgressService.activate(true);
    return this._httpClient.put<Donation>(this.url, request).pipe(
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

  private _genDonationUpdateRequest(originalDonation: Donation, donationUpdate: Partial<Donation>): DonationUpdateRequest {
    const donation: Donation = Object.assign({}, originalDonation);
    Object.keys(donationUpdate).forEach((property: string) => donation[property] = donationUpdate[property]);
    return { donation };
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
    return this._httpClient.get<Donation>(url).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  listenDonationsQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Donation>> {
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
        return this.getDonations(filters, page, limit);
      })
    );
  }

  getDonations(filters: DonationReadFilters, page = 1, limit = 10): Observable<ListResponse<Donation>> {
    const request = <DonationReadRequest>filters;
    request.page = page;
    request.limit = limit;
    const params = new HttpParams({ fromObject: <any>request });
    this._pageProgressService.activate(true);
    return this._httpClient.get<ListResponse<Donation>>(this.url, { params }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
