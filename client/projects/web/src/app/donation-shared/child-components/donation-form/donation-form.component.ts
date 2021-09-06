import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { DonateForm } from '~web/donation/forms/donate.form';
import { FormHelperService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-donation-form',
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
