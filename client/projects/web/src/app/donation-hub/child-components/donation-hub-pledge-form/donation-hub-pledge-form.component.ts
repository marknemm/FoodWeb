import { Component, OnInit } from '@angular/core';
import { DonationHubPledgeForm } from '~web/donation-hub/forms/donation-hub-pledge.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-donation-hub-pledge-form',
  templateUrl: './donation-hub-pledge-form.component.html',
  styleUrls: ['./donation-hub-pledge-form.component.scss'],
  providers: formProvider(DonationHubPledgeFormComponent)
})
export class DonationHubPledgeFormComponent extends FormBaseComponent<DonationHubPledgeForm> implements OnInit {

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new DonationHubPledgeForm(), formHelperService);
  }

  ngOnInit() {}

}
