import { Component, Input } from '@angular/core';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';

@Component({ template: '' })
export class UsernameBaseComponent extends FormBaseComponent<string> {

  @Input() editable = false;

  constructor(formHelperService: FormHelperService) {
    super(() => new TFormControl<string>(), formHelperService);
  }
}
