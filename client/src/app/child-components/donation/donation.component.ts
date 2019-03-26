import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { FormHelperService } from '../../services/form-helper/form-helper.service';
import { ConstantsService } from '../../services/constants/constants.service';
import { Validation } from '../../../../../shared/src/constants/validation';

@Component({
  selector: 'food-web-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroup: FormGroup;
  @Input() formGroupName: string;

  readonly document: Document = document;

  constructor(
    public constantsService: ConstantsService,
    private _formGroupDirective: FormGroupDirective,
    private _formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.formGroup = this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    this._formHelper.addMissingControls(
      this.formGroup,
      {
        id: null,
        donorFirstName: ['', Validators.required],
        donorLastName: ['', Validators.required],
        donationType: [null, Validators.required],
        description: ['', Validators.required],
        estimatedValue: [null, [Validators.required, Validators.min(0), Validators.pattern(Validation.MONEY_REGEX)]]
      }
    );
    if (this.formGroupName && this._formGroupDirective.form) {
      this._formGroupDirective.form.setControl(this.formGroupName, this.formGroup);
    }
  }

  canShowOtherTypeInput(): boolean {
    const donationType: string = this.formGroup.get('donationType').value;
    return (donationType != null && this.constantsService.DONATION_TYPES.indexOf(donationType) < 0);
  }

}
