import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationSaveData } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { DonationSaveService } from '~web/donation/services/donation-save/donation-save.service';
import { DonateForm } from '~web/donor/forms/donate.form';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-edit',
  templateUrl: './donation-edit.component.html',
  styleUrls: ['./donation-edit.component.scss'],
})
export class DonationEditComponent implements OnInit {

  private _donationNotFound = false;
  private _editForm: DonateForm;
  private _originalDonation: Donation;
  private _donationDetailsUrl = '';

  constructor(
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _dateTimeService: DateTimeService,
    private _donationReadService: DonationReadService,
    private _donationSaveService: DonationSaveService,
    private _pageProgressService: PageProgressService,
    private _router: Router,
    private _urlQueryService: UrlQueryService
  ) {}

  get donationNotFound(): boolean {
    return this._donationNotFound;
  }

  get editForm(): DonateForm {
    return this._editForm;
  }

  get originalDonation(): Donation {
    return this._originalDonation;
  }

  ngOnInit() {
    this.pageTitleService.title = 'Edit Donation';
    this._editForm = new DonateForm(this._dateTimeService, { safetyChecklistInit: true });
    this._listenDonationChange();
  }

  private _listenDonationChange(): void {
    this._pageProgressService.activate(true);
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationReadService.getDonation(id))
    ).subscribe((donation: Donation) => this._setDonationData(donation));
  }

  private _setDonationData(donation: Donation): void {
    this._pageProgressService.deactivate();
    this._donationNotFound = !donation;
    this._originalDonation = donation;
    this._donationDetailsUrl = `/donation/details/${this.originalDonation.id}`;
    if (!this._donationNotFound) {
      this.editForm.patchFromDonation(donation);
      this.editForm.markAsPristine();
      this.editForm.markAsUntouched();
    }
  }

  saveDonation(): void {
    const donationUpdate: DonationSaveData = this.editForm.toDonationSaveData();
    this._donationSaveService.updateDonation(this.originalDonation, donationUpdate).subscribe(
      (savedDonation: Donation) => this._router.navigate([this._donationDetailsUrl], { state: savedDonation })
    );
  }

  cancelEdit(): void {
    this._router.navigate([this._donationDetailsUrl]);
  }

}
