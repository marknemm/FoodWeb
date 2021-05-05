import { Validators } from '@angular/forms';
import { SupportInfo, Validation } from '~shared';
import { TFormGroup } from '~web/forms';

export class SupportInfoForm extends TFormGroup<SupportInfo> {

  constructor(supportInfo?: Partial<SupportInfo>) {
    super({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
  }
}
