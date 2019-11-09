import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { Volunteer } from '../../../../../shared/src/interfaces/account/volunteer';

export class VolunteerForm extends TypedFormGroup<Volunteer> {

  constructor(volunteer?: Partial<Volunteer>) {
    super({
      id: undefined,
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      hasEquipment: [false, Validators.required]
    });
    if (volunteer) {
      this.patchValue(volunteer);
    }
  }
}
