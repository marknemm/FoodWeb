import { Component, Input } from '@angular/core';
import { Receiver } from '~shared';
import { ReceiverForm } from '~web/account/forms/receiver.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class ReceiverBaseComponent extends FormBaseComponent<Receiver> {

  @Input() editing = false;
  @Input() formGroup: ReceiverForm;

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
