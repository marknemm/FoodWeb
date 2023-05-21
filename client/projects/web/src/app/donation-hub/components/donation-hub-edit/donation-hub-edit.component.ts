import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationHub } from '~shared';
import { DonationHubForm, DonationHubFormAdapter, DonationHubFormData } from '~web/donation-hub/services/donation-hub-form-adapter/donation-hub-form-adapter.service';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { DonationHubUpdateService } from '~web/donation-hub/services/donation-hub-update/donation-hub-update.service';
import { FormFieldService } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donation-hub-edit',
  templateUrl: './donation-hub-edit.component.html',
  styleUrls: ['./donation-hub-edit.component.scss'],
  providers: [FormFieldService]
})
export class DonationHubEditComponent implements OnInit {

  readonly minRegisterDate = new Date();
  readonly postEditRoute = ['/', 'donation-hub'];

  protected _donationHubNotFound = false;
  protected _originalDonationHub: DonationHub;

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _donationHubFormAdapter: DonationHubFormAdapter,
    protected _donationHubReadService: DonationHubReadService,
    protected _donationHubUpdateService: DonationHubUpdateService,
    protected _formFieldService: FormFieldService<DonationHubFormData, DonationHubForm>,
    protected _router: Router,
    protected _shellService: ShellService,
    protected _urlQueryService: UrlQueryService,
    sessionService: SessionService
  ) {
    this._formFieldService.registerControl(
      this._donationHubFormAdapter.toForm({ account: sessionService.account, omitChecklists: true })
    );
  }

  get donationHubForm(): DonationHubForm {
    return this._formFieldService.control;
  }

  get donationHubNotFound(): boolean {
    return this._donationHubNotFound;
  }

  get originalDonationHub(): DonationHub {
    return this._originalDonationHub;
  }

  get pageTitle(): string {
    return this._shellService.pageTitle;
  }

  ngOnInit(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubReadService.getDonationHub(id))
    ).subscribe((donationHub: DonationHub) => this._setDonationHubData(donationHub));
  }

  private _setDonationHubData(donationHub: DonationHub): void  {
    this._originalDonationHub = donationHub;
    this._donationHubNotFound = !donationHub;
    if (!this.donationHubNotFound) {
      this.donationHubForm.reset(
        this._donationHubFormAdapter.toViewModel(donationHub));
    }
  }

  save(): void {
    this.donationHubForm.markAllAsTouched();
    if (this.donationHubForm.valid) {
      this._donationHubUpdateService.updateDonationHub(
        this._donationHubFormAdapter.toModel(this.donationHubForm)
      ).subscribe(
        (donationHub: DonationHub) => this._router.navigate(this.postEditRoute.concat(`${donationHub.id}`))
      );
    }
  }

  filterDateSaturday(date: Date): boolean {
    return (date && date.getDay() === 6);
  }
}
