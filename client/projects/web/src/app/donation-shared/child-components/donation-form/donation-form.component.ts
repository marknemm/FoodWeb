import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DonateForm, DonateFormAdapter } from '~web/donation/services/donate-form-adapter/donate-form-adapter.service';
import { FormFieldService } from '~web/forms';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-donation-form',
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.scss'],
  providers: [FormFieldService]
})
export class DonationFormComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public constantsService: ConstantsService,
    private _donateFormAdapter: DonateFormAdapter,
    private _formFieldService: FormFieldService<DonateForm>,
    private _sessionService: SessionService,
  ) {}

  get donateForm(): DonateForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._donateFormAdapter.toForm({ donorAccount: this._sessionService.account })
    });
  }

}
