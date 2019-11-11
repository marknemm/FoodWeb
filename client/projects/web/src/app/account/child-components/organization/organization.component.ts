import { Component, OnInit, Input, SimpleChanges, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FormHelperService } from '~web/shared';

import { OrganizationForm } from '~web/account/forms/organization.form';

@Component({
  selector: 'food-web-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  @Input() editing = false;
  @Input() accountType: string = '';
  @Input() formGroup: OrganizationForm;
  @Input() formGroupName: string;

  deliveryInstructionsPlaceholderModifier: string = '';

  constructor(
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelper: FormHelperService,
  ) {}

  ngOnInit() {
    this.formGroup = <OrganizationForm>this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountType) {
      let newAcctType = changes.accountType.currentValue;
      this.deliveryInstructionsPlaceholderModifier =
        'Please leave instructions for donation ' + 
        (newAcctType === 'Donor' ? 'pickups' : 'deliveries') +
        ' here';
    }
  }
}
