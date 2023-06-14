import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationSaveData } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonateForm, DonateFormAdapter } from '~web/donation/services/donate-form-adapter/donate-form-adapter.service';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { DonationSaveService } from '~web/donation/services/donation-save/donation-save.service';
import { SessionService } from '~web/session/services/session/session.service';
import { DestroyService } from '~web/shared/services/destroy/destroy.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donation-edit',
  templateUrl: './donation-edit.component.html',
  styleUrls: ['./donation-edit.component.scss'],
  providers: [DestroyService]
})
export class DonationEditComponent implements OnInit {

  protected _donationNotFound = false;
  protected _editForm: DonateForm = this._donateFormAdapter.toForm({
    destroy$: this._destroyService.destroy$,
    donorAccount: this._sessionService.account,
    initSafetyChecklist: true
  });
  protected _originalDonation: Donation;
  protected _donationDetailsUrl = '';

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _dateTimeService: DateTimeService,
    protected _destroyService: DestroyService,
    protected _donateFormAdapter: DonateFormAdapter,
    protected _donationReadService: DonationReadService,
    protected _donationSaveService: DonationSaveService,
    protected _pageProgressService: PageProgressService,
    protected _router: Router,
    protected _sessionService: SessionService,
    protected _shellService: ShellService,
    protected _urlQueryService: UrlQueryService,
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

  get pageTitle(): string {
    return this._shellService.pageTitle;
  }

  ngOnInit(): void {
    this._shellService.pageTitle = 'Edit Donation';
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
      this.editForm.patchValue(this._donateFormAdapter.toViewModel(donation));
      this.editForm.markAsPristine();
      this.editForm.markAsUntouched();
    }
  }

  saveDonation(): void {
    const donationUpdate: DonationSaveData = this._donateFormAdapter.toModel(this.editForm);
    this._donationSaveService.updateDonation(this.originalDonation, donationUpdate).subscribe(
      (savedDonation: Donation) => this._router.navigate([this._donationDetailsUrl], { state: savedDonation })
    );
  }

  cancelEdit(): void {
    this._router.navigate([this._donationDetailsUrl]);
  }

}
