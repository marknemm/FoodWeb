import { Component, Input } from '@angular/core';
import { ReceiverForm } from '~web/account-shared/forms/receiver.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class ReceiverBaseComponent extends FormBaseComponent<ReceiverForm> {

  @Input() editable = false;

  constructor(formHelperService: FormHelperService) {
    super(new ReceiverForm(), formHelperService);
  }
}
