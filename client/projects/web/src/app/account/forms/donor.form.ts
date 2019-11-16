import { TypedFormGroup } from '~web/typed-form-group';
import { Donor } from '~shared';

export class DonorForm extends TypedFormGroup<Donor> {

  constructor(donor?: Partial<Donor>) {
    super({ id: undefined });
    if (donor) {
      this.patchValue(donor);
    }
  }
}
