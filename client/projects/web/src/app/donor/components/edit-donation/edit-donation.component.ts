import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { Donation, DonationService } from '~web/donation/donation/donation.service';
import { DonateForm } from '~web/donor/donate.form';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-edit-donation',
  templateUrl: './edit-donation.component.html',
  styleUrls: ['./edit-donation.component.scss'],
})
export class EditDonationComponent implements OnInit {

  private _donationNotFound = false;
  private _editForm: DonateForm;
  private _originalDonation: Donation;
  private _donationDetailsUrl = '';

  constructor(
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _dateTimeService: DateTimeService,
    private _donationService: DonationService,
    private _pageProgressService: PageProgressService,
    private _router: Router
  ) {}

  get donationNotFound(): boolean {
    return this._donationNotFound;
  }

  get editForm(): DonateForm {
    return this._editForm;
  }

  ngOnInit() {
    this.pageTitleService.title = 'Edit Donation';
    this._editForm = new DonateForm(this._dateTimeService, { safetyChecklistInit: true });
    this._listenDonationChange();
  }

  private _listenDonationChange(): void {
    this._pageProgressService.activate(true);
    this._donationService.listenDonationQueryChange(this._activatedRoute).subscribe((donation: Donation) =>
      setTimeout(() => this._updateDonation(donation))
    );
  }

  private _updateDonation(donation: Donation): void {
    this._pageProgressService.reset();
    this._donationNotFound = !donation;
    this._originalDonation = donation;
    this._donationDetailsUrl = `/donation/details/${this._originalDonation.id}`;
    if (!this._donationNotFound) {
      this.editForm.patchFromDonation(donation);
      this.editForm.markAsPristine();
      this.editForm.markAsUntouched();
    }
  }

  saveDonation(): void {
    const donationUpdate: Donation = this.editForm.toDonation();
    this._donationService.updateDonation(this._originalDonation, donationUpdate).subscribe(
      (savedDonation: Donation) => this._router.navigate([this._donationDetailsUrl], { state: savedDonation })
    );
  }

  cancelEdit(): void {
    this._router.navigate([this._donationDetailsUrl]);
  }

}
