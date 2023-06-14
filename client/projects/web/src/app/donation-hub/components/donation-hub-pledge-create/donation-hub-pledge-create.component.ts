import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeCreateService } from '~web/donation-hub/services/donation-hub-pledge-create/donation-hub-pledge-create.service';
import { DonationHubPledgeForm, DonationHubPledgeFormAdapter } from '~web/donation-hub/services/donation-hub-pledge-form-adapter/donation-hub-pledge-form-adapter.service';
import { FormFieldProviders, FormFieldService  } from '~web/forms';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-create',
  templateUrl: './donation-hub-pledge-create.component.html',
  styleUrls: ['./donation-hub-pledge-create.component.scss'],
  providers: [FormFieldProviders]
})
export class DonationHubPledgeCreateComponent implements OnInit {

  readonly postCreateRoute: string[] = ['/', 'donation-hub', 'pledge'];

  readonly agreementChecklistMembers = [
    `I'll handle food safely`,
    `I'll use fresh ingredients`,
    `I won't participate if I'm sick`,
    `I'll notify FoodWeb if I'm ill`
  ];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _formFieldService: FormFieldService<DonationHubPledgeForm>,
    private _pledgeCreateService: DonationHubPledgeCreateService,
    private _pledgeFormAdapter: DonationHubPledgeFormAdapter,
    private _router: Router,
    private _shellService: ShellService,
  ) {
    this._shellService.pageTitle = 'Pledge Donation';
  }

  get pageTitle(): string {
    return this._shellService.pageTitle;
  }

  get pledgeForm(): DonationHubPledgeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({ genDefault: () => this._pledgeFormAdapter.toForm() });
  }

  donate(): void {
    this.pledgeForm.markAllAsTouched();
    if (this.pledgeForm.valid) {
      const donationHubId: number = parseInt(this._activatedRoute.snapshot.paramMap.get('id'), 10);
      const pledge: DonationHubPledge = this._pledgeFormAdapter.toModel(this.pledgeForm);
      this._pledgeCreateService.createDonationPledge(pledge, donationHubId).subscribe(
        (pledge: DonationHubPledge) => this._router.navigate(this.postCreateRoute.concat(`${pledge.id}`))
      );
    }
  }
}
