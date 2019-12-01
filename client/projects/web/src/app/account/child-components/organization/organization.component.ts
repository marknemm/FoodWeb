import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { OrganizationForm } from '~web/account/organization.form';

@Component({
  selector: 'food-web-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  @Input() editing = false;
  @Input() accountType: string = '';
  @Input() formGroup: OrganizationForm;

  deliveryInstructionsPlaceholderModifier: string = '';

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.formGroup = this.formGroup ? this.formGroup : new OrganizationForm();
    if (changes.accountType) {
      let newAcctType = changes.accountType.currentValue;
      this.deliveryInstructionsPlaceholderModifier =
        'Please leave instructions for donation ' + 
        (newAcctType === 'Donor' ? 'pickups' : 'deliveries') +
        ' here';
    }
  }
}
