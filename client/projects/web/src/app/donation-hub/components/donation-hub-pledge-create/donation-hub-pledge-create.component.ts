import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeForm } from '~web/donation-hub/forms/donation-hub-pledge.form';
import { DonationHubPledgeCreateService } from '~web/donation-hub/services/donation-hub-pledge-create/donation-hub-pledge-create.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-create',
  templateUrl: './donation-hub-pledge-create.component.html',
  styleUrls: ['./donation-hub-pledge-create.component.scss'],
  providers: formProvider(DonationHubPledgeCreateComponent)
})
export class DonationHubPledgeCreateComponent extends FormBaseComponent<DonationHubPledgeForm> implements OnInit {

  readonly postCreateRoute: string[] = ['/', 'donation-hub', 'pledge'];

  readonly agreementChecklistMembers = [
    `I'll handle food safely`,
    `I'll use fresh ingredients`,
    `I won't participate if I'm sick`,
    `I'll notify FoodWeb if I'm ill`
  ];

  constructor(
    formHelperService: FormHelperService,
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _pledgeCreateService: DonationHubPledgeCreateService,
    private _router: Router
  ) {
    super(() => new DonationHubPledgeForm(), formHelperService, true);
  }

  ngOnInit() {
    this.pageTitleService.title = 'Pledge Donation';
  }

  donate(): void {
    if (this.formGroup.checkValidity()) {
      const donationHubId: number = parseInt(this._activatedRoute.snapshot.paramMap.get('id'), 10);
      this._pledgeCreateService.createDonationPledge(this.formGroup.value, donationHubId).subscribe(
        (pledge: DonationHubPledge) => this._router.navigate(this.postCreateRoute.concat(`${pledge.id}`))
      );
    }
  }
}
