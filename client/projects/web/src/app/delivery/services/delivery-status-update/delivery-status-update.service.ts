import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DeliveryStateChangeRequest, Donation, DonationHelper, DonationStatus, LatLngLiteral } from '~shared';
import { environment } from '~web-env/environment';
import { CurrentLocationService } from '~web/map/services/current-location/current-location.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryStatusUpdateService {

  /**
   * The REST endpoint URL for a delivery resource.
   */
  readonly url = `${environment.server}/delivery`;

  constructor(
    private _currentLocationService: CurrentLocationService,
    private _donationHelper: DonationHelper,
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  advanceDeliveryState(donation: Donation): Observable<Donation> {
    const advanceUrl = `${this.url}/advance/${donation.claim.delivery.id}`;
    const successMessage = this._genDeliveryAdvanceSuccessMsg(donation.donationStatus);

    return this._genStateChangeRequest(donation).pipe(
      switchMap((request: DeliveryStateChangeRequest) =>
        this._httpClient.put<Donation>(advanceUrl, request, { withCredentials: true }).pipe(
          this._httpResponseService.handleHttpResponse<Donation>({ successMessage })
        )
      )
    );
  }

  undoDeliveryState(donation: Donation): Observable<Donation> {
    const undoUrl = `${this.url}/undo/${donation.claim.delivery.id}`;
    const successMessage = this._genDeliveryUndoSuccessMsg(donation.donationStatus);

    return this._genStateChangeRequest(donation).pipe(
      switchMap((request: DeliveryStateChangeRequest) =>
        this._httpClient.put<Donation>(undoUrl, request, { withCredentials: true }).pipe(
          this._httpResponseService.handleHttpResponse<Donation>({ successMessage })
        )
      )
    );
  }

  private _genDeliveryAdvanceSuccessMsg(donationStatus: DonationStatus): string {
    const nextDonationStatus: DonationStatus = this._donationHelper.getNextDonationStatus(donationStatus);
    return `Successfully advanced delivery state to '${nextDonationStatus}'`;
  }

  private _genDeliveryUndoSuccessMsg(donationStatus: DonationStatus): string {
    const prevDonationStatus: DonationStatus = this._donationHelper.getPrevDonationStatus(donationStatus);
    return (prevDonationStatus !== 'Matched')
      ? `Successfully reverted delivery state to '${prevDonationStatus}'`
      : 'Successfully cancelled delivery';
  }

  private _genStateChangeRequest(donation: Donation): Observable<DeliveryStateChangeRequest> {
    return new Observable((subscriber: Subscriber<DeliveryStateChangeRequest>) =>
      this._currentLocationService.getCurrentLatLngLiteral().subscribe((currentLocation: LatLngLiteral) =>
        subscriber.next({ donationId: donation.id, currentLocation })
      )
    );
  }
}
