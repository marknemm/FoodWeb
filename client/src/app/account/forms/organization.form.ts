import { Validators } from '@angular/forms';
import { DonorForm } from './donor.form';
import { ReceiverForm } from './receiver.form';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { Organization } from '../../../../../shared/src/interfaces/account/organization';

export class OrganizationForm extends TypedFormGroup<Organization> {

  constructor(organization?: Partial<Organization>) {
    super({
      id: undefined,
      organizationName: ['', Validators.required],
      deliveryInstructions: '',
      organizationInfo: '',
      donor: new DonorForm(),
      receiver: new ReceiverForm()
    });
    if (organization) {
      this.patchValue(organization);
    }
  }
}
