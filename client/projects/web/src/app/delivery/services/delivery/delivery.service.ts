import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of, Subscriber } from 'rxjs';
import { catchError, finalize, flatMap, map } from 'rxjs/operators';
import { Account, DateTimeRange, DeliveryHelper, DeliveryReadRequest, DeliveryScheduleRequest, DeliveryStateChangeRequest, Donation, DonationStatus, LatLngLiteral, ListResponse } from '~shared';
import { environment } from '~web/environments/environment';
import { SessionService } from '~web/session/session/session.service';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';
import { CurrentLocationService } from '~web/shared/services/current-location/current-location.service';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  /**
   * The REST endpoint URL for a delivery resource.
   */
  readonly url = `${environment.server}/delivery`;

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _pageProgressService: PageProgressService,
    private _errorHandlerService: ErrorHandlerService,
    private _alertService: AlertService,
    private _sessionService: SessionService,
    private _deliveryHelper: DeliveryHelper,
    private _currentLocationService: CurrentLocationService
  ) {}

  scheduleDelivery(donation: Donation, pickupWindow: DateTimeRange): Observable<Donation> {
    const myAccount: Account = this._sessionService.account;
    if (!this._validateDeliverySchedulePrivilege(donation, myAccount)) {
      return of(donation);
    }

    const scheduleRequest: DeliveryScheduleRequest = { donationId: donation.id, pickupWindow };
    this._pageProgressService.activate(true);
    return this._httpClient.post<Donation>(this.url, scheduleRequest, { withCredentials: true }).pipe(
      map((scheduledDonation: Donation) => {
        this._alertService.displaySimpleMessage('Successfully started delivery', 'success');
        return scheduledDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  advanceDeliveryState(donation: Donation): Observable<Donation> {
    const myAccount: Account = this._sessionService.account;
    if (!this._validateDeliveryStateAdvancePrivilege(donation, myAccount)) {
      return of(donation);
    }

    this._pageProgressService.activate(true);
    return this._genStateChangeRequest(donation).pipe(
      flatMap((request: DeliveryStateChangeRequest) =>
        this._httpClient.put<Donation>(
          `${this.url}/advance/${ donation.claim.delivery.id }`,
          request,
          { withCredentials: true }
        ).pipe(
          map((advancedDonation: Donation) => {
            this._displayDeliveryAdvanceSuccessMsg(advancedDonation.donationStatus);
            return advancedDonation;
          }),
          catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
          finalize(() => this._pageProgressService.reset())
        )
      )
    );
  }

  private _genStateChangeRequest(donation: Donation): Observable<DeliveryStateChangeRequest> {
    return new Observable((subscriber: Subscriber<DeliveryStateChangeRequest>) =>
      this._currentLocationService.getCurrentLatLngLiteral().subscribe((currentLocation: LatLngLiteral) =>
        subscriber.next({ donationId: donation.id, currentLocation })
      )
    );
  }

  undoDeliveryState(donation: Donation): Observable<Donation> {
    const myAccount: Account = this._sessionService.account;
    if (!this._validateDeliveryStateUndoPrivilege(donation, myAccount)) {
      return of(donation);
    }

    this._pageProgressService.activate(true);
    return this._genStateChangeRequest(donation).pipe(
      flatMap((request: DeliveryStateChangeRequest) =>
        this._httpClient.put<Donation>(
          `${this.url}/undo/${donation.claim.delivery.id}`,
          request,
          { withCredentials: true }
        ).pipe(
          map((revertedDonation: Donation) => {
            this._displayDeliveryUndoSuccessMsg(revertedDonation.donationStatus);
            return revertedDonation;
          }),
          catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
          finalize(() => this._pageProgressService.reset())
        )
      )
    );
  }

  listenDeliveriesQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Donation>> {
    return activatedRoute.queryParamMap.pipe(
      flatMap((params: ParamMap) => {
        const filters: DeliveryReadRequest = {
          page: (params.has('page') ? parseInt(params.get('page'), 10) : 1),
          limit: (params.has('limit') ? parseInt(params.get('limit'), 10) : 10)
        };
        params.keys.forEach((paramKey: string) => {
          if (paramKey !== 'page' && paramKey !== 'limit') {
            filters[paramKey] = params.get(paramKey);
          }
        });
        return (this._router.url.indexOf('my') >= 0)
          ? this.getMyDeliveries(filters)
          : (this._router.url.indexOf('unscheduled') >= 0)
          ? this.getUnscheduledDeliveries(filters)
          : this._getDeliveries(filters);
      })
    );
  }

  getMyDeliveries(request: DeliveryReadRequest): Observable<ListResponse<Donation>> {
    return this._getDeliveries(request, '/my');
  }

  getUnscheduledDeliveries(request: DeliveryReadRequest): Observable<ListResponse<Donation>> {
    return this._getDeliveries(request, '/unscheduled');
  }

  private _getDeliveries(request: DeliveryReadRequest, subRoute = ''): Observable<ListResponse<Donation>> {
    const getUrl: string = (this.url + subRoute);
    request.page = request.page ? request.page : 1;
    request.limit = request.limit ? request.limit : 10;
    const params = new HttpParams({ fromObject: <any>request });
    this._pageProgressService.activate(true);
    return this._httpClient.get<ListResponse<Donation>>(getUrl, { params, withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  private _validateDeliverySchedulePrivilege(donation: Donation, myAccount: Account): boolean {
    const validErr: string = this._deliveryHelper.validateDeliverySchedulePrivilege(donation.donationStatus, myAccount);
    if (validErr) {
      this._errorHandlerService.handleError(new Error(validErr));
      return false;
    }
    return true;
  }

  private _validateDeliveryStateAdvancePrivilege(donation: Donation, myAccount: Account): boolean {
    const validErr: string = this._deliveryHelper.validateDeliveryAdvancePrivilege(donation.claim.delivery, donation.donationStatus, myAccount);
    if (validErr) {
      this._errorHandlerService.handleError(new Error(validErr));
      return false;
    }
    return true;
  }

  private _displayDeliveryAdvanceSuccessMsg(donationStatus: DonationStatus): void {
    const successMsg = `Successfully advanced delivery state to '${donationStatus}'`;
    this._alertService.displaySimpleMessage(successMsg, 'success');
  }

  private _validateDeliveryStateUndoPrivilege(donation: Donation, myAccount: Account): boolean {
    const validErr: string = this._deliveryHelper.validateDeliveryUndoPrivilege(donation.claim.delivery, donation.donationStatus, myAccount);
    if (validErr) {
      this._errorHandlerService.handleError(new Error(validErr));
      return false;
    }
    return true;
  }

  private _displayDeliveryUndoSuccessMsg(donationStatus: DonationStatus): void {
    const successMsg = (donationStatus !== 'Matched')
      ? `Successfully reverted delivery state to '${donationStatus}'`
      : 'Successfully cancelled delivery';
    this._alertService.displaySimpleMessage(successMsg, 'success');
  }
}
