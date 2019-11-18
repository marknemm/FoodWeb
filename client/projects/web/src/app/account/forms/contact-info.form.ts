import { Validators } from '@angular/forms';
import { TypedFormGroup } from '~web/typed-form-group';
import { ContactInfo, Validation } from '~shared';

export class ContactInfoForm extends TypedFormGroup<ContactInfo> {

  constructor(contactInfo?: Partial<ContactInfo>) {
    super({
      id: undefined,
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(Validation.POSTAL_CODE_REGEX)]]
    });
    if (contactInfo) {
      this.patchValue(contactInfo);
    }
  }
}
