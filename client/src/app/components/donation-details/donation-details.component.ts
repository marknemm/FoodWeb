import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTimeSelectDialogComponent, DateTimeSelectConfig } from '../date-time-select-dialog/date-time-select-dialog.component';
import { DonationAction } from '../../child-components/donation-detail-actions/donation-detail-actions.component';
import { DonationService, Donation } from '../../services/donation/donation.service';
import { DeliveryService } from '../../services/delivery/delivery.service';
import { SessionService } from '../../services/session/session.service';
import { DateTimeRange } from '../../services/date-time/date-time.service';
import { DonationFormService } from '../../services/donation-form/donation-form.service';
import { AccountHelper } from '../../../../../shared/src/helpers/account-helper';
import { DonationHelper } from '../../../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../../../shared/src/helpers/delivery-helper';

@Component({
  selector: 'food-web-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.scss'],
  providers: [DonationFormService]
})
export class DonationDetailsComponent implements OnInit, OnDestroy {

  donationForm: FormGroup;

  private _myDonation = false;
  private _donationNotFound = false;
  private _originalDonation: Donation;
  private _editing = false;
  private _destroy$ = new Subject();

  constructor(
    public accountHelper: AccountHelper,
    public donationHelper: DonationHelper,
    public deliveryHelper: DeliveryHelper,
    public sessionService: SessionService,
    private _donationFormService: DonationFormService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _donationService: DonationService,
    private _deliveryService: DeliveryService,
    private _matDialog: MatDialog
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
    this.donationForm = this._donationFormService.buildUpdateDonationForm();
    this._listenDonationChange();
  }

  ngOnDestroy() {
    this._destroy$.next();
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
    if (this.donationForm.valid && this.donationForm.dirty) {
      const donationUpdate: Partial<Donation> = this._donationFormService.getDonationFromForm();
      this._donationService.updateDonation(this._originalDonation, donationUpdate).subscribe(
        (savedDonation: Donation) => {
          this._updateDonation(savedDonation);
          this.toggleEdit();
        }
      );
    } else {
      this.toggleEdit();
    }
  }

  deleteDonation(): void {
    this._donationService.deleteDonation(this._originalDonation).subscribe(() =>
      this._router.navigate(['/donations/my'])
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
    this._donationService.listenDonationQueryChange(this._activatedRoute).pipe(
      takeUntil(this._destroy$)
    ).subscribe((donation: Donation) => {
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
    this._donationFormService.updateFormValue(donation);
    this._myDonation = this.sessionService.isMyAccount(donation.donorAccount.id);
  }

}
