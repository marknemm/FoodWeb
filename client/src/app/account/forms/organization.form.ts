import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { Organization } from '../../../../../shared/src/interfaces/account/organization';

@Injectable()
export class OrganizationForm extends TypedFormGroup<Organization> {

  constructor(organization?: Partial<Organization>) {
    super({
      id: undefined,
      organizationName: ['', Validators.required],
      deliveryInstructions: '',
      organizationInfo: ''
    });
    if (organization) {
      this.patchValue(organization);
    }
  }
}
