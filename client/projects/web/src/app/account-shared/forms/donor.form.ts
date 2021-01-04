import { Donor } from '~shared';
import { TFormGroup } from '~web/forms';

export class DonorForm extends TFormGroup<Donor> {

  constructor(donor?: Partial<Donor>) {
    super({ id: undefined });
    if (donor) {
      this.patchValue(donor);
    }
  }
}
