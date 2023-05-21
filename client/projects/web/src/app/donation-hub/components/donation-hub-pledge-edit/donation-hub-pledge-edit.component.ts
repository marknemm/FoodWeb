import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { DonationHubPledgeUpdateService } from '~web/donation-hub/services/donation-hub-pledge-update/donation-hub-pledge-update.service';
import { FormFieldService } from '~web/forms';
import { ShellService } from '~web/shell/services/shell/shell.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';
import { DonationHubPledgeForm, DonationHubPledgeFormAdapter } from '~web/donation-hub/services/donation-hub-pledge-form-adapter/donation-hub-pledge-form-adapter.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-edit',
  templateUrl: './donation-hub-pledge-edit.component.html',
  styleUrls: ['./donation-hub-pledge-edit.component.scss'],
  providers: [FormFieldService]
})
export class DonationHubPledgeEditComponent implements OnInit {

  readonly postEditRoute = ['/', 'donation-hub', 'pledge'];

  private _pledgeNotFound = false;
  private _originalDonationHubPledge: DonationHubPledge;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _formFieldService: FormFieldService<DonationHubPledgeForm>,
    private _pledgeFormAdapter: DonationHubPledgeFormAdapter,
    private _pledgeReadService: DonationHubPledgeReadService,
    private _pledgeUpdateService: DonationHubPledgeUpdateService,
    private _router: Router,
    private _shellService: ShellService,
    private _urlQueryService: UrlQueryService,
  ) {
    this._shellService.pageTitle = 'Edit Donation Pledge';
  }

  get originalPledge(): DonationHubPledge {
    return this._originalDonationHubPledge;
  }

  get pageTitle(): string {
    return this._shellService.pageTitle;
  }

  get pledgeForm(): DonationHubPledgeForm {
    return this._formFieldService.control;
  }

  get pledgeNotFound(): boolean {
    return this._pledgeNotFound;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._pledgeFormAdapter.toForm({ omitChecklist: true })
    });

    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._pledgeReadService.getDonationHubPledge(id))
    ).subscribe((pledge: DonationHubPledge) => this._setDonationHubPledgeData(pledge));
  }

  private _setDonationHubPledgeData(pledge: DonationHubPledge): void  {
    this._originalDonationHubPledge = pledge;
    this._pledgeNotFound = !pledge;
    if (!this.pledgeNotFound) {
      this.pledgeForm.reset(pledge);
    }
  }

  save(): void {
    this.pledgeForm.markAllAsTouched();
    if (this.pledgeForm.valid) {
      const pledge: DonationHubPledge = this._pledgeFormAdapter.toModel(this.pledgeForm);
      this._pledgeUpdateService.updateDonationHubPledge(pledge).subscribe(
        (pledge: DonationHubPledge) => this._router.navigate(this.postEditRoute.concat(`${pledge.id}`))
      );
    }
  }
}
