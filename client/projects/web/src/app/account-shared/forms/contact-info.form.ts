import { Validators } from '@angular/forms';
import { ContactInfo, Validation } from '~shared';
import { TFormGroup } from '~web/forms';

export class ContactInfoForm extends TFormGroup<ContactInfo> {

  constructor(contactInfo?: Partial<ContactInfo>) {
    super({
      id: undefined,
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(Validation.POSTAL_CODE_REGEX)]],
      location: undefined,
      timezone: undefined,
      enableEmail: true,
      enablePushNotification: true,
      notifyForEachDonation: true
    });
    if (contactInfo) {
      this.patchValue(contactInfo);
    }
  }
}
