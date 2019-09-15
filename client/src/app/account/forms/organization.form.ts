import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { Organization } from '../../../../../shared/src/interfaces/account/organization';

export class OrganizationForm extends TypedFormGroup<Organization> {

  constructor(organization: Partial<Organization> = {}) {
    super({
      id: undefined,
      organizationName: ['', Validators.required],
      deliveryInstructions: '',
      organizationInfo: ''
    });
    this.patchValue(organization);
  }
}
