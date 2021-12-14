import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AccountType, Organization } from '~shared';
import { OrganizationForm } from '~web/account-shared/forms/organization.form';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
  providers: [FormFieldService]
})
export class OrganizationComponent implements OnChanges, OnInit {

  @Input() accountType: AccountType;
  @Input() editable = false;
  @Input() get value(): Organization             { return this._formFieldService.value; }
           set value(organization: Organization) { this._formFieldService.valueIn(organization); }

  protected _deliveryInstrLabel = '';

  constructor(
    private _formFieldService: FormFieldService<OrganizationForm>
  ) {}

  get deliveryInstrLabel(): string {
    return this._deliveryInstrLabel;
  }

  get isReceiver(): boolean {
    return this.accountType === AccountType.Receiver;
  }

  get organizationForm(): OrganizationForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new OrganizationForm()
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountType) {
      const accountMod: string = (this.accountType === AccountType.Donor) ? 'Pickup' : 'Delivery';
      this._deliveryInstrLabel = `Donation ${accountMod} Instructions:`;
    }
  }
}
