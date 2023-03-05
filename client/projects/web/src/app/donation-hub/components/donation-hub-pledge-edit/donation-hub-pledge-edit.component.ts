import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeForm } from '~web/donation-hub/forms/donation-hub-pledge.form';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { DonationHubPledgeUpdateService } from '~web/donation-hub/services/donation-hub-pledge-update/donation-hub-pledge-update.service';
import { FormFieldService } from '~web/forms';
import { ShellService } from '~web/shell/services/shell/shell.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-edit',
  templateUrl: './donation-hub-pledge-edit.component.html',
  styleUrls: ['./donation-hub-pledge-edit.component.scss'],
  providers: [FormFieldService]
})
export class DonationHubPledgeEditComponent implements OnInit {

  readonly postEditRoute = ['/', 'donation-hub', 'pledge'];

  private _donationHubPledgeNotFound = false;
  private _originalDonationHubPledge: DonationHubPledge;

  constructor(
    public shellService: ShellService,
    private _activatedRoute: ActivatedRoute,
    private _donationHubPledgeReadService: DonationHubPledgeReadService,
    private _donationHubPledgeUpdateService: DonationHubPledgeUpdateService,
    private _formFieldService: FormFieldService<DonationHubPledgeForm>,
    private _router: Router,
    private _urlQueryService: UrlQueryService,
  ) {
    this.shellService.pageTitle = 'Edit Donation Pledge';
  }

  get donationHubPledgeNotFound(): boolean {
    return this._donationHubPledgeNotFound;
  }

  get originalDonationHubPledge(): DonationHubPledge {
    return this._originalDonationHubPledge;
  }

  get pledgeForm(): DonationHubPledgeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new DonationHubPledgeForm({ omitChecklist: true })
    });

    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubPledgeReadService.getDonationHubPledge(id))
    ).subscribe((pledge: DonationHubPledge) => this._setDonationHubPledgeData(pledge));
  }

  private _setDonationHubPledgeData(pledge: DonationHubPledge): void  {
    this._originalDonationHubPledge = pledge;
    this._donationHubPledgeNotFound = !pledge;
    if (!this.donationHubPledgeNotFound) {
      this.pledgeForm.reset(pledge);
    }
  }

  save(): void {
    this.pledgeForm.markAllAsTouched();
    if (this.pledgeForm.valid) {
      this._donationHubPledgeUpdateService.updateDonationHubPledge(this.pledgeForm.value).subscribe(
        (pledge: DonationHubPledge) => this._router.navigate(this.postEditRoute.concat(`${pledge.id}`))
      );
    }
  }
}
