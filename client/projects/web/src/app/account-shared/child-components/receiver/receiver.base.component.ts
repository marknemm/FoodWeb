import { Component, Input } from '@angular/core';
import { ReceiverForm } from '~web/account-shared/forms/receiver.form';
import { Convert } from '~web/component-decorators';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export class ReceiverBaseComponent extends FormBaseComponent<ReceiverForm> {

  @Convert()
  @Input() editable: boolean = false;

  constructor(formHelperService: FormHelperService) {
    super(new ReceiverForm(), formHelperService);
  }
}
