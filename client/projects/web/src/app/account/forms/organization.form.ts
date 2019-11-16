import { Validators } from '@angular/forms';
import { TypedFormGroup } from '~web/typed-form-group';
import { Organization } from '~shared';

import { DonorForm } from '~web/donor.form';
import { ReceiverForm } from '~web/receiver.form';

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
