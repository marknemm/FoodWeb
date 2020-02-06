import { Validators } from '@angular/forms';
import { Organization } from '~shared';
import { DonorForm } from '~web/account/donor.form';
import { ReceiverForm } from '~web/account/receiver.form';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class OrganizationForm extends TypedFormGroup<Organization> {

  constructor(organization?: Partial<Organization>) {
    super({
      id: undefined,
      name: ['', Validators.required],
      deliveryInstructions: '',
      description: '',
      donor: new DonorForm(),
      receiver: new ReceiverForm()
    });
    if (organization) {
      this.patchValue(organization);
    }
  }
}
