import { Component, Input } from '@angular/core';
import { VolunteerForm } from '~web/account-shared/forms/volunteer.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class VolunteerBaseComponent extends FormBaseComponent<VolunteerForm> {

  @Input() editable = false;

  constructor(formHelperService: FormHelperService) {
    super(new VolunteerForm(), formHelperService);
  }
}
