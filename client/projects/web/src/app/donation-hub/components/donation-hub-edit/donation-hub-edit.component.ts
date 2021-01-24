import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationHub } from '~shared';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonationHubForm } from '~web/donation-hub/forms/donation-hub.form';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { DonationHubUpdateService } from '~web/donation-hub/services/donation-hub-update/donation-hub-update.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub-edit',
  templateUrl: './donation-hub-edit.component.html',
  styleUrls: ['./donation-hub-edit.component.scss'],
  providers: formProvider(DonationHubEditComponent)
})
export class DonationHubEditComponent extends FormBaseComponent<DonationHubForm> implements OnInit {

  readonly minRegisterDate = new Date();

  private _donationHubNotFound = false;
  private _originalDonationHub: DonationHub;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _donationHubReadService: DonationHubReadService,
    private _donationHubUpdateService: DonationHubUpdateService,
    private _router: Router,
    private _urlQueryService: UrlQueryService,
    dateTimeService: DateTimeService,
    formHelperService: FormHelperService,
    sessionService: SessionService
  ) {
    super(() => new DonationHubForm(dateTimeService, { account: sessionService.account, omitChecklists: true }), formHelperService, true);
  }

  get donationHubNotFound(): boolean {
    return this._donationHubNotFound;
  }

  get originalDonationHub(): DonationHub {
    return this._originalDonationHub;
  }

  ngOnInit() {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubReadService.getDonationHub(id))
    ).subscribe((donationHub: DonationHub) => this._setDonationHubData(donationHub));
  }

  private _setDonationHubData(donationHub: DonationHub): void  {
    this._originalDonationHub = donationHub;
    this._donationHubNotFound = !donationHub;
    if (!this.donationHubNotFound) {
      this.formGroup.reset(donationHub);
    }
  }

  save(): void {
    if (this.formGroup.checkValidity()) {
      this._donationHubUpdateService.updateDonationHub(this.formGroup.toDonationHub()).subscribe(
        (donationHub: DonationHub) => this._router.navigate(['/donation-hub', 'details', donationHub.id])
      );
    }
  }

  filterDateSaturday(date: Date): boolean {
    return (date && date.getDay() === 6);
  }
}
