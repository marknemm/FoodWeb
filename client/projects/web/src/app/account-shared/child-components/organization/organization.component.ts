import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AccountType, Organization } from '~shared';
import { OrganizationForm, OrganizationFormAdapter, OrganizationFormData } from '~web/account-shared/services/organization-form-adapter/organization-form-adapter.service';
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
  @Input() get value(): Organization              { return this._organizationFormAdapter.toModel(this.organizationForm); }
           set value(organization: Organization)  { this.organizationForm.patchValue(
                                                      this._organizationFormAdapter.toViewModel(organization), { emitEvent: false }); }

  protected _deliveryInstrLabel = '';

  constructor(
    private _formFieldService: FormFieldService<OrganizationFormData, OrganizationForm>,
    private _organizationFormAdapter: OrganizationFormAdapter,
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
      genDefault: () => this._organizationFormAdapter.toForm()
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountType) {
      const accountMod: string = (this.accountType === AccountType.Donor) ? 'Pickup' : 'Delivery';
      this._deliveryInstrLabel = `Donation ${accountMod} Instructions:`;
    }
  }
}
