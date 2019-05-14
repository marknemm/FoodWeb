import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { FormHelperService } from '../../services/form-helper/form-helper.service';

@Component({
  selector: 'food-web-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  @Input() editing = false;
  @Input() accountType: string = '';
  @Input() formGroup: FormGroup;
  @Input() formGroupName: string;
  deliveryInstructionsPlaceholderModifier: string = '';

  constructor(
    private _formGroupDirective: FormGroupDirective,
    private _formHelper: FormHelperService,
  ) {}

  ngOnInit() {
    this.formGroup = this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    this._formHelper.addMissingControls(
      this.formGroup,
      {
        id: undefined,
        organizationName: ['', Validators.required],
        deliveryInstructions: '',
        organizationInfo: ''
      }
    );
    if (this.formGroupName && this._formGroupDirective.form) {
      this._formGroupDirective.form.setControl(this.formGroupName, this.formGroup);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    let newAcctType = changes.accountType.currentValue;
    this.deliveryInstructionsPlaceholderModifier =
      'Please leave instructions for donation ' + 
      (newAcctType === 'Donor' ? 'pickups' : 'deliveries') +
      ' here';
    console.log(changes.accountType.previousValue + ' --> ' + changes.accountType.currentValue);
  }
}
