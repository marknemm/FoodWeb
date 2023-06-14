import { Component, OnInit } from '@angular/core';
import { DonationHubPledgeForm, DonationHubPledgeFormAdapter } from '~web/donation-hub/services/donation-hub-pledge-form-adapter/donation-hub-pledge-form-adapter.service';
import { FormFieldProviders, FormFieldService  } from '~web/forms';

@Component({
  selector: 'foodweb-donation-hub-pledge-form',
  templateUrl: './donation-hub-pledge-form.component.html',
  styleUrls: ['./donation-hub-pledge-form.component.scss'],
  providers: [FormFieldProviders]
})
export class DonationHubPledgeFormComponent implements OnInit {

  constructor(
    private _formFieldService: FormFieldService<DonationHubPledgeForm>,
    private _pledgeFormAdapter: DonationHubPledgeFormAdapter,
  ) {}

  get pledgeForm(): DonationHubPledgeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._pledgeFormAdapter.toForm()
    });
  }

}
