import { Component, Input } from '@angular/core';
import { ReceiverForm } from '~web/account-shared/forms/receiver.form';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export class ReceiverBaseComponent extends FormBaseComponent<ReceiverForm> {

  @Input() editable = false;

  constructor(formHelperService: FormHelperService) {
    super(new ReceiverForm(), formHelperService);
  }
}
