import { Component, Input } from '@angular/core';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService, TFormControl } from '~web/forms';

@Component({ template: '' })
export class UsernameBaseComponent extends FormBaseComponent<string> {

  @Convert()
  @Input() editable: boolean = false;

  constructor(formHelperService: FormHelperService) {
    super(new TFormControl<string>(), formHelperService);
  }
}
