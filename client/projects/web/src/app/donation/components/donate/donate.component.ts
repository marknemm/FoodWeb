import { Component, OnInit } from '@angular/core';
import { Donation, DonationSaveData } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonateForm, DonateFormAdapter } from '~web/donation/services/donate-form-adapter/donate-form-adapter.service';
import { DonationSaveService } from '~web/donation/services/donation-save/donation-save.service';
import { SessionService } from '~web/session/services/session/session.service';
import { DestroyService } from '~web/shared/services/destroy/destroy.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  providers: [DestroyService]
})
export class DonateComponent implements OnInit {

  readonly foodSafetyChecklistMembers: ReadonlyArray<string> = [
    'Food storage area is clean',
    'Proper personal hygiene observed',
    'Food has been temperature controlled',
    'No bulging or leaking packages',
    'Mold or decay is not present',
    'Food has not expired',
  ];

  /**
   * Reactive form model used for donation.
   */
  readonly donateForm: DonateForm = this._donateFormAdapter.toForm({
    destroy$: this._destroyService.destroy$,
    donorAccount: this._sessionService.account
  });;

  /**
   * The newly saved donation that is only set once the donation is complete.
   * Will be unset if the user chooses to donate again.
   */
  private _savedDonation: Donation = null;

  constructor(
    protected _dateTimeService: DateTimeService,
    protected _destroyService: DestroyService,
    protected _donateFormAdapter: DonateFormAdapter,
    protected _donationSaveService: DonationSaveService,
    protected _sessionService: SessionService,
    protected _shellService: ShellService,
  ) {}

  get isSafetyChecklistErrVisible(): boolean {
    return this.donateForm.controls.safetyChecklist.touched
        && this.donateForm.controls.safetyChecklist.hasError('required');
  }

  get savedDonation(): Donation {
    return this._savedDonation;
  }

  ngOnInit(): void {
    this._shellService.pageTitle = 'Donate';
  }

  /**
   * Submits the donation to be created on the server.
   */
  donate(): void {
    this.donateForm.markAllAsTouched();
    if (this.donateForm.valid) {
      const donationSaveData: DonationSaveData = this._donateFormAdapter.toModel(this.donateForm);
      this._donationSaveService.createDonation(donationSaveData).subscribe((savedDonation: Donation) => {
        this._savedDonation = savedDonation;
      });
    }
  }

  /**
   * Resets the donation form to create another donation.
   */
  donateAgain(): void {
    this.donateForm.reset();
    this._savedDonation = null;
  }

}
