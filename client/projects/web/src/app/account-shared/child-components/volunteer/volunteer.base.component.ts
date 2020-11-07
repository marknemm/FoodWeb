import { Component, Input } from '@angular/core';
import { VolunteerForm } from '~web/account-shared/forms/volunteer.form';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export class VolunteerBaseComponent extends FormBaseComponent<VolunteerForm> {

  @Input() editable = false;

  constructor(formHelperService: FormHelperService) {
    super(new VolunteerForm(), formHelperService);
  }
}
