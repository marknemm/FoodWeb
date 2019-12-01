import { NotificationSettings } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class NotificationSettingsForm extends TypedFormGroup<NotificationSettings> {

  constructor(notificationSettings?: Partial<NotificationSettings>) {
    super({
      enableEmail: undefined,
      enablePushNotification: undefined,
      notifyForEachDonation: undefined
    });
    if (notificationSettings) {
      this.patchValue(notificationSettings);
    }
  }
}
