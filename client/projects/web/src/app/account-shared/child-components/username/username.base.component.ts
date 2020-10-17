import { Component, Input } from '@angular/core';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class UsernameBaseComponent extends FormBaseComponent<string> {

  @Input() editable = false;

  constructor(formHelperService: FormHelperService) {
    super(new TFormControl<string>(), formHelperService);
  }
}
