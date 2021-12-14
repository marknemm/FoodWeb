import { Component, OnInit } from '@angular/core';
import { DonationHubPledgeForm } from '~web/donation-hub/forms/donation-hub-pledge.form';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-donation-hub-pledge-form',
  templateUrl: './donation-hub-pledge-form.component.html',
  styleUrls: ['./donation-hub-pledge-form.component.scss'],
  providers: [FormFieldService]
})
export class DonationHubPledgeFormComponent implements OnInit {

  constructor(
    private _formFieldService: FormFieldService<DonationHubPledgeForm>
  ) {}

  get pledgeForm(): DonationHubPledgeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new DonationHubPledgeForm()
    });
  }

}
