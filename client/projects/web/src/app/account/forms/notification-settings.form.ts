import { Validators } from '@angular/forms';
import { NotificationSettings } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class NotificationSettingsForm extends TypedFormGroup<NotificationSettings> {

  constructor(notificationSettings?: Partial<NotificationSettings>) {
    super({
      enableEmail: [false, Validators.required],
      enablePushNotification: [false, Validators.required],
      notifyForEachDonation: [false, Validators.required]
    });
    if (notificationSettings) {
      this.patchValue(notificationSettings);
    }
  }
}
