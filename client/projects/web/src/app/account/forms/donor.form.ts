import { Donor } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class DonorForm extends TypedFormGroup<Donor> {

  constructor(donor?: Partial<Donor>) {
    super({ id: undefined });
    if (donor) {
      this.patchValue(donor);
    }
  }
}
