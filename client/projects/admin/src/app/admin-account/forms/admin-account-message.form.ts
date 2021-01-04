import { Validators } from '@angular/forms';
import { SendMessageRequest } from '~shared';
import { TFormGroup } from '~web/forms';

export class AdminAccountMessageForm extends TFormGroup<SendMessageRequest> {

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
