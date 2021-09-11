import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { DonateForm } from '~web/donation/forms/donate.form';
import { FormFieldService } from '~web/forms';
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
    private _dateTimeService: DateTimeService,
    private _formFieldService: FormFieldService<DonateForm>
  ) {}

  get donateForm(): DonateForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new DonateForm(this._dateTimeService)
    });
  }

}
