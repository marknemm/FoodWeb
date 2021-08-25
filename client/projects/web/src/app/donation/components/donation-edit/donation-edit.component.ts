import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationSaveData } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { DonationSaveService } from '~web/donation/services/donation-save/donation-save.service';
import { DonateForm } from '~web/donation/forms/donate.form';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-edit',
  templateUrl: './donation-edit.component.html',
  styleUrls: ['./donation-edit.component.scss'],
})
export class DonationEditComponent implements OnInit {

  protected _donationNotFound = false;
  protected _editForm: DonateForm;
  protected _originalDonation: Donation;
  protected _donationDetailsUrl = '';

  constructor(
    public pageTitleService: PageTitleService,
    protected _activatedRoute: ActivatedRoute,
    protected _dateTimeService: DateTimeService,
    protected _donationReadService: DonationReadService,
    protected _donationSaveService: DonationSaveService,
    protected _pageProgressService: PageProgressService,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService
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
    this._donationDetailsUrl = `/donation/${this.originalDonation.id}`;
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
