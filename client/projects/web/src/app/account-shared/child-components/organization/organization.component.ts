import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AccountType } from '~shared';
import { OrganizationForm } from '~web/account-shared/forms/organization.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
  providers: formProvider(OrganizationComponent)
})
export class OrganizationComponent extends FormBaseComponent<OrganizationForm> implements OnChanges {

  @Input() accountType: AccountType;

  protected _deliveryInstrLabel = '';

  constructor(formHelperService: FormHelperService) {
    super(() => new OrganizationForm(), formHelperService);
  }

  get deliveryInstrLabel(): string {
    return this._deliveryInstrLabel;
  }

  get isReceiver(): boolean {
    return this.accountType === AccountType.Receiver;
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.accountType) {
      const accountMod: string = (this.accountType === AccountType.Donor) ? 'Pickup' : 'Delivery';
      this._deliveryInstrLabel = `Donation ${accountMod} Instructions:`;
    }
  }
}
