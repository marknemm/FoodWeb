import { Validators } from '@angular/forms';
import { TypedFormGroup } from '~web/data-structure';
import { Organization } from '~shared';

import { DonorForm } from '~web/account/forms/donor.form';
import { ReceiverForm } from '~web/account/forms/receiver.form';

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
