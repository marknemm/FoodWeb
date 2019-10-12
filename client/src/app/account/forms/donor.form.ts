import { TypedFormGroup } from '../../../app/data-structure/typed-form-group';
import { Donor } from '../../../../../shared/src/interfaces/account/donor';

export class DonorForm extends TypedFormGroup<Donor> {

  constructor(donor?: Partial<Donor>) {
    super({ id: undefined });
    if (donor) {
      this.patchValue(donor);
    }
  }
}
