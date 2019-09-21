import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { Volunteer } from '../../../../../shared/src/interfaces/account/volunteer';

@Injectable()
export class VolunteerForm extends TypedFormGroup<Volunteer> {

  constructor(volunteer?: Partial<Volunteer>) {
    super({
      id: undefined,
      lastName: ['', Validators.required],
      firstName: ['', Validators.required]
    });
    if (volunteer) {
      this.patchValue(volunteer);
    }
  }
}