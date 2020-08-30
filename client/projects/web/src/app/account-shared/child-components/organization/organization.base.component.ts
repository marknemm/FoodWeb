import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AccountType, Organization } from '~shared';
import { OrganizationForm } from '~web/account/forms/organization.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class OrganizationBaseComponent extends FormBaseComponent<Organization> implements OnChanges {

  @Input() accountType: AccountType;
  @Input() formGroup: OrganizationForm;
  @Input() editing = false;

  protected _deliveryInstrLabel = '';
  protected _readonlyDeliveryInstrLabel = '';

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  get deliveryInstrLabel(): string {
    return this._deliveryInstrLabel;
  }

  get isReceiver(): boolean {
    return this.accountType === AccountType.Receiver;
  }

  get readonlyDeliveryInstrLabel(): string {
    return this._readonlyDeliveryInstrLabel;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountType) {
      const accountMod: string = (this.accountType === AccountType.Donor) ? 'pickups' : 'deliveries';
      this._deliveryInstrLabel = `Please leave instructions for donation ${accountMod} here`;
      this._readonlyDeliveryInstrLabel = (this.accountType === AccountType.Donor)
        ? 'Instructions for Pickup:'
        : 'Instructions for Drop-Off';
    }
  }
}
