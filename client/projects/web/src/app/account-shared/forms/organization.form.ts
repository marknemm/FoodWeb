import { Validators } from '@angular/forms';
import { Organization } from '~shared';
import { TFormGroup } from '~web/forms';
import { DonorForm } from './donor.form';
import { ReceiverForm } from './receiver.form';

export class OrganizationForm extends TFormGroup<Organization> {

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
