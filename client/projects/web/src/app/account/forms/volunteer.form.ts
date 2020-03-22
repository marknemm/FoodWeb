import { Validators } from '@angular/forms';
import { Volunteer } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class VolunteerForm extends TypedFormGroup<Volunteer> {

  constructor(volunteer?: Partial<Volunteer>) {
    super({
      id: undefined,
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      signedAgreement: [false, Validators.required]
    });
    if (volunteer) {
      this.patchValue(volunteer);
    }
  }
}
