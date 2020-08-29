import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AccountType } from '~shared';
import { OrganizationForm } from '~web/account/forms/organization.form';

@Component({
  selector: 'foodweb-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  @Input() accountType: AccountType;
  @Input() editing = false;
  @Input() formGroup: OrganizationForm;

  private _deliveryInstrLabel = '';

  constructor() {}

  get deliveryInstrLabel(): string {
    return this._deliveryInstrLabel;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.formGroup = this.formGroup ? this.formGroup : new OrganizationForm();
    if (changes.accountType) {
      const accountMod: string = (this.accountType === AccountType.Donor) ? 'pickups' : 'deliveries';
      this._deliveryInstrLabel = `Please leave instructions for donation ${accountMod} here`;
    }
  }
}
