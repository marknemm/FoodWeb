import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeForm } from '~web/donation-hub/forms/donation-hub-pledge.form';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { DonationHubPledgeUpdateService } from '~web/donation-hub/services/donation-hub-pledge-update/donation-hub-pledge-update.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-edit',
  templateUrl: './donation-hub-pledge-edit.component.html',
  styleUrls: ['./donation-hub-pledge-edit.component.scss'],
  providers: formProvider(DonationHubPledgeEditComponent)
})
export class DonationHubPledgeEditComponent extends FormBaseComponent<DonationHubPledgeForm> implements OnInit {

  private _donationHubPledgeNotFound = false;
  private _originalDonationHubPledge: DonationHubPledge;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _donationHubPledgeReadService: DonationHubPledgeReadService,
    private _donationHubPledgeUpdateService: DonationHubPledgeUpdateService,
    private _router: Router,
    private _urlQueryService: UrlQueryService,
    formHelperService: FormHelperService
  ) {
    super(() => new DonationHubPledgeForm({ omitChecklist: true }), formHelperService, true);
  }

  get donationHubPledgeNotFound(): boolean {
    return this._donationHubPledgeNotFound;
  }

  get originalDonationHubPledge(): DonationHubPledge {
    return this._originalDonationHubPledge;
  }

  ngOnInit() {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubPledgeReadService.getDonationHubPledge(id))
    ).subscribe((pledge: DonationHubPledge) => this._setDonationHubPledgeData(pledge));
  }

  private _setDonationHubPledgeData(pledge: DonationHubPledge): void  {
    this._originalDonationHubPledge = pledge;
    this._donationHubPledgeNotFound = !pledge;
    if (!this.donationHubPledgeNotFound) {
      this.formGroup.reset(pledge);
    }
  }

  save(): void {
    if (this.formGroup.checkValidity()) {
      this._donationHubPledgeUpdateService.updateDonationHubPledge(this.formGroup.value).subscribe(
        (pledge: DonationHubPledge) => this._router.navigate(['/donation-hub', 'pledge', pledge.id])
      );
    }
  }
}
