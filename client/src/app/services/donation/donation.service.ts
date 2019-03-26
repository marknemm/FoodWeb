import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { PageProgressService } from '../page-progress/page-progress.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { AlertService } from '../alert/alert.service';
import { DonationCreateRequest, Donation } from '../../../../../shared/src/interfaces/donation/donation-create-request';
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
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset()),
      map((savedDonation: Donation) => {
        this._alertService.displaySimpleMessage('Donation successful', 'success');
        return savedDonation;
      })
    );
  }
}
