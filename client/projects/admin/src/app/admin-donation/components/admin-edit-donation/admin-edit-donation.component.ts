import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AdminDonationSaveService } from '~admin/admin-donation/admin-donation-save/admin-donation-save.service';
import { AdminDonationForm } from '~admin/admin-donation/admin-donation.form';
import { Donation } from '~shared';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';
import { DonationReadService } from '~web/donation/donation-read/donation-read.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-admin-edit-donation',
  templateUrl: './admin-edit-donation.component.html',
  styleUrls: ['./admin-edit-donation.component.scss'],
})
export class AdminEditDonationComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  private _donationDetailsUrl = '';
  private _donationNotFound = false;
  private _formGroup: AdminDonationForm;
  private _originalDonation: Donation;

  constructor(
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _adminDonationSaveService: AdminDonationSaveService,
    private _dateTimeService: DateTimeService,
    private _donationReadService: DonationReadService,
    private _pageProgressService: PageProgressService,
    private _router: Router
  ) {}

  get donationNotFound(): boolean {
    return this._donationNotFound;
  }

  get formGroup(): AdminDonationForm {
    return this._formGroup;
  }

  ngOnInit() {
    this.pageTitleService.title = 'Edit Donation';
    this._formGroup = new AdminDonationForm(this._dateTimeService, this._destroy$);
    this._listenDonationChange();
  }

  private _listenDonationChange(): void {
    this._pageProgressService.activate(true);
    this._donationReadService.listenDonationQueryChange(this._activatedRoute).subscribe(
      (donation: Donation) => this._updateDonation(donation)
    );
  }

  private _updateDonation(donation: Donation): void {
    this._pageProgressService.reset();
    this._donationNotFound = !donation;
    this._originalDonation = donation;
    this._donationDetailsUrl = `/donation/details/${this._originalDonation.id}`;
    if (!this._donationNotFound) {
      this._formGroup.patchFromDonation(donation);
      this._formGroup.markAsPristine();
      this._formGroup.markAsUntouched();
    }
  }

  ngOnDestroy() {
    this._destroy$.next(); // Cleanup RxJS subscriptions.
  }

  submitDonation(): void {
    this._adminDonationSaveService.updateDonation(this.formGroup).subscribe(
      (savedDonation: Donation) => this._router.navigate([this._donationDetailsUrl], { state: savedDonation })
    );
  }

  cancelEdit(): void {
    this._router.navigate([this._donationDetailsUrl]);
  }

}