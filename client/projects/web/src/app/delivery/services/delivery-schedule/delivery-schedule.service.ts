import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DateTimeRange, DeliveryScheduleRequest, Donation } from '~shared';
import { DateTimeRangeRadioConfig, DateTimeRangeRadioDialogComponent } from '~web/date-time/components/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { environment } from '~web/../environments/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryScheduleService {

  /**
   * The REST endpoint URL for a delivery resource.
   */
  readonly url = `${environment.server}/delivery`;

  constructor(
    protected _httpClient: HttpClient,
    protected _httpResponseService: HttpResponseService,
    protected _matDialog: MatDialog
  ) {}

  /**
   * Schedules a delivery for a given donation.
   * @param donation The donation that is to have an associated delivery scheduled for it.
   * @return An observable that emits the donation that had its delivery scheduled once the server operation completes.
   * If the user cancelled the request by closing the delivery pickup window schedule dialog, then the input/original
   * donation is emitted immediately.
   */
  scheduleDelivery(donation: Donation): Observable<Donation> {
    return this._showPickupWindowDialog(donation).pipe(
      switchMap((pickupWindow: DateTimeRange) =>
        (pickupWindow)
          ? this._sendDeliveryScheduleRequest({ donationId: donation.id, pickupWindow })
          : of(donation)
      )
    );
  }

  /**
   * Shows a delivery pickup window dialog allowing the volunteer to schedule a narrowed pickup window for the donation.
   * @param donation The donaation that is to have its delivery scheduled.
   * @return An observable that emits the selected date time range on dialog close. If none was selected, then null.
   */
  protected _showPickupWindowDialog(donation: Donation): Observable<DateTimeRange> {
    const scheduleDialogData: DateTimeRangeRadioConfig = {
      title: 'Estimate Your Pickup Window',
      rangeWindowStart: donation.pickupWindowStart,
      rangeWindowEnd: donation.pickupWindowEnd
    };
    return DateTimeRangeRadioDialogComponent.open(this._matDialog, scheduleDialogData);
  }

  /**
   * Sends a delivery schedule request to the server.
   * @param request The delivery schedule request.
   * @return An observable that emits the donation whose delivery was schedueled after the server operation completes.
   */
  protected _sendDeliveryScheduleRequest(request: DeliveryScheduleRequest): Observable<Donation> {
    return this._httpClient.post<Donation>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<Donation>({ successMessage: 'Successfully started delivery' })
    );
  }
}
