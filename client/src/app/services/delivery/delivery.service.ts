import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, finalize, flatMap } from 'rxjs/operators';
import { PageProgressService } from '../page-progress/page-progress.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { AlertService } from '../alert/alert.service';
import { SessionService } from '../session/session.service';
import { Donation, DonationStatus } from '../../../../../shared/src/interfaces/donation/donation';
import { Account } from '../../../../../shared/src/interfaces/account/account';
import { DeliveryHelper } from '../../../../../shared/src/helpers/delivery-helper';
import { DeliveryScheduleRequest } from '../../../../../shared/src/interfaces/delivery/delivery-schedule-request';
import { DeliveryStateChangeRequest } from '../../../../../shared/src/interfaces/delivery/delivery-state-change-request';
import { ListResponse } from '../../../../../shared/src/interfaces/list-response';
import { DeliveryReadRequest, DeliveryReadFilters } from '../../../../../shared/src/interfaces/delivery/delivery-read-request';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  /**
   * The REST endpoint URL for a delivery resource.
   */
  readonly url = '/server/delivery';

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _pageProgressService: PageProgressService,
    private _errorHandlerService: ErrorHandlerService,
    private _alertService: AlertService,
    private _sessionService: SessionService,
    private _deliveryHelper: DeliveryHelper
  ) {}

  scheduleDelivery(donation: Donation): Observable<Donation> {
    const myAccount: Account = this._sessionService.account;
    if (!this._validateDeliverySchedulePrivilege(donation, myAccount)) {
      return of(donation);
    }

    const scheduleRequest: DeliveryScheduleRequest = { donationId: donation.id };
    this._pageProgressService.activate(true);
    return this._httpClient.post<Donation>(this.url, scheduleRequest).pipe(
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

    const stateChangeRequest: DeliveryStateChangeRequest = { donationId: donation.id };
    this._pageProgressService.activate(true);
    return this._httpClient.put<Donation>(`${this.url}/advance/${ donation.delivery.id }`, stateChangeRequest).pipe(
      map((advancedDonation: Donation) => {
        this._displayDeliveryAdvanceSuccessMsg(advancedDonation.donationStatus);
        return advancedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  undoDeliveryState(donation: Donation): Observable<Donation> {
    const myAccount: Account = this._sessionService.account;
    if (!this._validateDeliveryStateUndoPrivilege(donation, myAccount)) {
      return of(donation);
    }

    const stateChangeRequest: DeliveryStateChangeRequest = { donationId: donation.id };
    this._pageProgressService.activate(true);
    return this._httpClient.put<Donation>(`${this.url}/undo/${donation.delivery.id}`, stateChangeRequest).pipe(
      map((revertedDonation: Donation) => {
        this._displayDeliveryUndoSuccessMsg(revertedDonation.donationStatus);
        return revertedDonation;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  listenDeliveriesQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Donation>> {
    return activatedRoute.queryParamMap.pipe(
      flatMap((params: ParamMap) => {
        const filters: DeliveryReadFilters = {};
        params.keys.forEach((paramKey: string) => {
          if (paramKey !== 'page' && paramKey !== 'limit') {
            filters[paramKey] = params.get(paramKey);
          }
        });
        const page: number = (params.has('page') ? parseInt(params.get('page'), 10) : undefined);
        const limit: number = (params.has('limit') ? parseInt(params.get('limit'), 10) : undefined);
        return (this._router.url.indexOf('my') >= 0)
          ? this.getMyDeliveries(filters, page, limit)
          : (this._router.url.indexOf('unscheduled') >= 0)
          ? this.getUnscheduledDeliveries(filters, page, limit)
          : this._getDeliveries(filters, page, limit);
      })
    );
  }

  getMyDeliveries(filters: DeliveryReadFilters, page = 1, limit = 10): Observable<ListResponse<Donation>> {
    return this._getDeliveries(filters, page, limit, '/my');
  }

  getUnscheduledDeliveries(filters: DeliveryReadFilters, page = 1, limit = 10): Observable<ListResponse<Donation>> {
    return this._getDeliveries(filters, page, limit, '/unscheduled');
  }

  private _getDeliveries(filters: DeliveryReadFilters, page: number, limit: number, subRoute = ''): Observable<ListResponse<Donation>> {
    const getUrl: string = (this.url + subRoute);
    const request = <DeliveryReadRequest>filters;
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

  private _validateDeliverySchedulePrivilege(donation: Donation, myAccount: Account): boolean {
    const validErr: string = this._deliveryHelper.validateDeliverySchedulePrivilege(donation.donationStatus, myAccount);
    if (validErr) {
      this._errorHandlerService.handleError(new Error(validErr));
      return false;
    }
    return true;
  }

  private _validateDeliveryStateAdvancePrivilege(donation: Donation, myAccount: Account): boolean {
    const validErr: string = this._deliveryHelper.validateDeliveryAdvancePrivilege(donation.delivery, donation.donationStatus, myAccount);
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
    const validErr: string = this._deliveryHelper.validateDeliveryUndoPrivilege(donation.delivery, donation.donationStatus, myAccount);
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
