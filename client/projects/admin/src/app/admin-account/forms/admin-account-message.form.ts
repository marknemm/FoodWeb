import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SendMessageRequest } from '~shared';

export interface AdminAccountMessageFormT {
  messageBodyHTML: FormControl<string>,
  messageSubject: FormControl<string>
}

export class AdminAccountMessageForm extends FormGroup<AdminAccountMessageFormT> {

  constructor(sendMessageReq?: Partial<SendMessageRequest>) {
    super({
      messageBodyHTML: new FormControl('', { validators: Validators.required, nonNullable: true }),
      messageSubject: new FormControl('', { validators: Validators.required, nonNullable: true })
    });
    if (sendMessageReq) {
      this.patchValue(sendMessageReq);
    }
  }

}
