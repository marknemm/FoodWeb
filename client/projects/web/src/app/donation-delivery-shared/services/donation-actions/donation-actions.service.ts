import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { DateTimeRange } from '~shared';
import { DateTimeRangeRadioDialogComponent, DateTimeRangeRadioConfig } from '~web/date-time/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { DeliveryService } from '~web/delivery/delivery/delivery.service';
import { Donation, DonationService } from '~web/donation/donation/donation.service';

export type DonationAction = 'ToggleEdit' | 'Save' | 'Delete' | 'Claim' | 'Unclaim' | 'ScheduleDelivery' | 'AdvanceDeliveryState' | 'UndoDeliveryState';

@Injectable({
  providedIn: 'root'
})
export class DonationActionsService {

  constructor(
    private _deliveryService: DeliveryService,
    private _donationService: DonationService,
    private _matDialog: MatDialog
  ) {}

  /**
   * Performs a given action on a given donation.
   * @param donation The donation that the action is targeting.
   * @param action The donation action.
   * @return An observable that emits the potentially updated donation after the action is completed.
   */
  onDonationAction(donation: Donation, action: DonationAction): Observable<Donation> {
    switch (action) {
      case 'Delete':                return this._deleteDonation(donation);
      case 'Claim':                 return this._donationService.claimDonation(donation);
      case 'Unclaim':               return this._donationService.unclaimDonation(donation);
      case 'ScheduleDelivery':      return this._scheduleDelivery(donation);
      case 'AdvanceDeliveryState':  return this._deliveryService.advanceDeliveryState(donation);
      case 'UndoDeliveryState':     return this._deliveryService.undoDeliveryState(donation);
    }
    throw new Error(`Could not handle unknown donation action: ${action}`);
  }

  /**
   * Deletes a given donation.
   * @param donation The donation that is to be deleted.
   * @return An observable that emits the deleted donation after the operation completes.
   */
  private _deleteDonation(donation: Donation): Observable<Donation> {
    return this._donationService.deleteDonation(donation).pipe(
      map(() => donation)
    );
  }

  /**
   * Schedules the delivery of a given donation.
   * @param donation The donation that is to be scheduled for delivery.
   * @return An observable that emits the updated donation after the schedule operaiton completes.
   */
  private _scheduleDelivery(donation: Donation): Observable<Donation> {
    const scheduleDialogData: DateTimeRangeRadioConfig = {
      title: 'Estimate Your Pickup Window',
      rangeWindowStart: donation.pickupWindowStart,
      rangeWindowEnd: donation.pickupWindowEnd
    };
    const pickupWindow$: Observable<DateTimeRange> = DateTimeRangeRadioDialogComponent.open(this._matDialog, scheduleDialogData);

    return pickupWindow$.pipe(
      flatMap((pickupWindow: DateTimeRange) =>
        (pickupWindow)
          ? this._deliveryService.scheduleDelivery(donation, pickupWindow)
          : of(donation)
      )
    );
  }
}
