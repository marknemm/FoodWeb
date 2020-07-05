import { Validators } from '@angular/forms';
import { SendMessageRequest } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class AdminAccountMessageForm extends TypedFormGroup<SendMessageRequest> {

  constructor(sendMessageReq?: Partial<SendMessageRequest>) {
    super({
      messageBodyHTML: ['', Validators.required],
      messageSubject: ['', Validators.required]
    });
    if (sendMessageReq) {
      this.patchValue(sendMessageReq);
    }
  }

}
