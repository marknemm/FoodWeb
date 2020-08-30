import { Component, Input } from '@angular/core';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class UsernameBaseComponent extends FormBaseComponent<string> {

  @Input() editing = false;

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
