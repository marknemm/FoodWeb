import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { OrganizationForm } from '../../forms/organization.form';
import { FormHelperService } from '../../../shared/services/form-helper/form-helper.service';

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
    private _formGroupDirective: FormGroupDirective,
    private _formHelper: FormHelperService,
  ) {}

  ngOnInit() {
    this.formGroup = this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
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
