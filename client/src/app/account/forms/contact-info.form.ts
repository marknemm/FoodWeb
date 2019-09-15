import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { ContactInfo } from '../../../../../shared/src/interfaces/account/contact-info';
import { Validation } from '../../../../../shared/src/constants/validation';

export class ContactInfoForm extends TypedFormGroup<ContactInfo> {

  constructor(contactInfo: Partial<ContactInfo> = {}) {
    super({
      id: undefined,
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(Validation.POSTAL_CODE_REGEX)]]
    });
    this.patchValue(contactInfo);
  }  
}
