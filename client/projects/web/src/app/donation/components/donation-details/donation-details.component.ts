import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountHelper, DateTimeRange, DeliveryHelper, DonationHelper } from '~shared';
import { DateTimeSelectConfig, DateTimeSelectDialogComponent } from '~web/date-time/date-time-select-dialog/date-time-select-dialog.component';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { DeliveryService } from '~web/delivery/delivery/delivery.service';
import { DonationAction } from '~web/donation/donation-detail-actions/donation-detail-actions.component';
import { Donation, DonationService } from '~web/donation/donation/donation.service';
import { DonateForm } from '~web/donor/donate.form';
import { SessionService } from '~web/session/session/session.service';

@Component({
  selector: 'food-web-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.scss']
})
export class DonationDetailsComponent implements OnInit {

  formGroup: DonateForm;

  private _myDonation = false;
  private _donationNotFound = false;
  private _originalDonation: Donation;
  private _editing = false;

  constructor(
    public accountHelper: AccountHelper,
    public donationHelper: DonationHelper,
    public deliveryHelper: DeliveryHelper,
    public sessionService: SessionService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _donationService: DonationService,
    private _deliveryService: DeliveryService,
    private _dateTimeService: DateTimeService
  ) {}

  get editing(): boolean {
    return this._editing;
  }

  get myDonation(): boolean {
    return this._myDonation;
  }

  get originalDonation(): Donation {
    return this._originalDonation;
  }

  get donationNotFound(): boolean {
    return this._donationNotFound;
  }

  ngOnInit() {
    this.formGroup = new DonateForm(this._dateTimeService, { safetyChecklistInit: true });
    this._listenDonationChange();
  }

  onDonationAction(action: DonationAction): void {
    switch (action) {
      case 'ToggleEdit':            return this.toggleEdit();
      case 'Save':                  return this.saveDonation();
      case 'Delete':                return this.deleteDonation();
      case 'Claim':                 return this.claimDonation();
      case 'Unclaim':               return this.unclaimDonation();
      case 'ScheduleDelivery':      return this.scheduleDelivery();
      case 'AdvanceDeliveryState':  return this.advanceDeliveryState();
      case 'UndoDeliveryState':     return this.undoDeliveryState();
    }
  }

  toggleEdit(): void {
    this._editing = !this.editing;
  }

  saveDonation(): void {
    const donationUpdate: Donation = this.formGroup.toDonation();
    this._donationService.updateDonation(this._originalDonation, donationUpdate).subscribe(
      (savedDonation: Donation) => {
        this._updateDonation(savedDonation);
        this.formGroup.markAsUntouched();
        this.formGroup.markAsPristine();
        this.toggleEdit();
      }
    );
  }

  deleteDonation(): void {
    this._donationService.deleteDonation(this._originalDonation).subscribe(() =>
      this._router.navigate(['/donation/list/my'])
    );
  }

  claimDonation(): void {
    this._donationService.claimDonation(this._originalDonation).subscribe(
      this._updateDonation.bind(this)
    );
  }

  unclaimDonation(): void {
    this._donationService.unclaimDonation(this._originalDonation).subscribe(
      this._updateDonation.bind(this)
    );
  }

  scheduleDelivery(): void {
    const scheduleDialogData: DateTimeSelectConfig = {
      selectTitle: 'Estimate Your Pickup Window',
      rangeMins: 15,
      rangeWindowStart: this.originalDonation.pickupWindowStart,
      rangeWindowEnd: this.originalDonation.pickupWindowEnd
    };
    const pickupWindow$: Observable<DateTimeRange> = DateTimeSelectDialogComponent.open(this._matDialog, scheduleDialogData);
    pickupWindow$.subscribe((pickupWindow: DateTimeRange) => {
      if (pickupWindow) {
        this._deliveryService.scheduleDelivery(this._originalDonation, pickupWindow).subscribe(
          this._updateDonation.bind(this)
        );
      }
    });
  }

  advanceDeliveryState(): void {
    this._deliveryService.advanceDeliveryState(this._originalDonation).subscribe(
      this._updateDonation.bind(this)
    );
  }

  undoDeliveryState(): void {
    this._deliveryService.undoDeliveryState(this._originalDonation).subscribe(
      this._updateDonation.bind(this)
    );
  }

  private _listenDonationChange(): void {
    this._donationService.listenDonationQueryChange(this._activatedRoute).subscribe((donation: Donation) => {
      setTimeout(() => {
        this._donationNotFound = !donation;
        if (!this._donationNotFound) {
          this._updateDonation(donation);
        }
      });
    });
  }

  private _updateDonation(donation: Donation): void {
    this._originalDonation = donation;
    this.formGroup.patchFromDonation(donation);
    this._myDonation = this.sessionService.isMyAccount(donation.donorAccount.id);
  }

}
