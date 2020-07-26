import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AdminScheduleDeliveryConfig, AdminScheduleDeliveryDialogComponent, AdminScheduleDeliveryDialogResult } from '~admin/admin-delivery/admin-schedule-delivery-dialog/admin-schedule-delivery-dialog.component';
import { AdminDeliveryScheduleRequest, Donation } from '~shared';
import { DeliveryScheduleService } from '~web/delivery/delivery-schedule/delivery-schedule.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDeliveryScheduleService extends DeliveryScheduleService {

  constructor(
    protected _httpClient: HttpClient,
    protected _httpResponseService: HttpResponseService,
    protected _matDialog: MatDialog
  ) {
    super(_httpClient, _httpResponseService, _matDialog);
  }

  /**
   * @override
   */
  scheduleDelivery(donation: Donation): Observable<Donation> {
    return this._genAdminDeliveryScheduleReq(donation).pipe(
      switchMap((scheduleReq: AdminDeliveryScheduleRequest) =>
        (scheduleReq)
          ? this._sendDeliveryScheduleRequest(scheduleReq)
          : of(donation)
      )
    );
  }

  private _genAdminDeliveryScheduleReq(donation: Donation): Observable<AdminDeliveryScheduleRequest> {
    const config: AdminScheduleDeliveryConfig = { donation };
    return this._matDialog.open(AdminScheduleDeliveryDialogComponent, { data: config }).afterClosed().pipe(
      map((dialogResult: AdminScheduleDeliveryDialogResult) =>
        (dialogResult)
          ? {
              donationId: donation.id,
              pickupWindow: dialogResult.pickupWindow,
              volunteerAccountId: dialogResult.volunteerAccount.id
            }
          : null
      )
    )
  }
}
