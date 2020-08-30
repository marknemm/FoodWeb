import { Component, Input } from '@angular/core';
import { Volunteer } from '~shared';
import { VolunteerForm } from '~web/account/forms/volunteer.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class VolunteerBaseComponent extends FormBaseComponent<Volunteer> {

  @Input() editing = false;
  @Input() formGroup: VolunteerForm;

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
