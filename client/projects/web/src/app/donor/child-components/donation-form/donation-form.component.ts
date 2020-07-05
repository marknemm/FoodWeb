import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { DonateForm } from '~web/donor/forms/donate.form';
import { ConstantsService } from '~web/shared/constants/constants.service';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-donation-form',
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.scss'],
  providers: [FormHelperService]
})
export class DonationFormComponent implements OnInit {

  @Input() formGroup: DonateForm;
  @Input() formGroupName = '';

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public constantsService: ConstantsService,
    private _formHelperService: FormHelperService
  ) {}

  ngOnInit() {
    this.formGroup = this._formHelperService.deriveAbstractControl(this.formGroupName, this.formGroup);
  }

}
