import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationHub } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonationHubForm, DonationHubFormT } from '~web/donation-hub/forms/donation-hub.form';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { DonationHubUpdateService } from '~web/donation-hub/services/donation-hub-update/donation-hub-update.service';
import { FormFieldService } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

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
    public shellService: ShellService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationHubReadService: DonationHubReadService,
    protected _donationHubUpdateService: DonationHubUpdateService,
    protected _formFieldService: FormFieldService<DonationHubForm, DonationHub>,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService,
    dateTimeService: DateTimeService,
    sessionService: SessionService
  ) {
    this._formFieldService.registerControl(
      new DonationHubForm(dateTimeService, { account: sessionService.account, omitChecklists: true }),
      {
        valueInConverter: (valueIn: DonationHub) => this.donationHubForm.fromDonationHub(valueIn),
        valueOutConverter: (value: DonationHubFormT) => this.donationHubForm.toDonationHub(value)
      }
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

  ngOnInit(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubReadService.getDonationHub(id))
    ).subscribe((donationHub: DonationHub) => this._setDonationHubData(donationHub));
  }

  private _setDonationHubData(donationHub: DonationHub): void  {
    this._originalDonationHub = donationHub;
    this._donationHubNotFound = !donationHub;
    if (!this.donationHubNotFound) {
      this.donationHubForm.reset(this._formFieldService.valueIn(donationHub));
    }
  }

  save(): void {
    this.donationHubForm.markAllAsTouched();
    if (this.donationHubForm.valid) {
      this._donationHubUpdateService.updateDonationHub(this.donationHubForm.toDonationHub()).subscribe(
        (donationHub: DonationHub) => this._router.navigate(this.postEditRoute.concat(`${donationHub.id}`))
      );
    }
  }

  filterDateSaturday(date: Date): boolean {
    return (date && date.getDay() === 6);
  }
}
