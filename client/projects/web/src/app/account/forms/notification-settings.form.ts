import { NotificationSettings } from '~shared';
import { TFormGroup } from '~web/forms';

export class NotificationSettingsForm extends TFormGroup<NotificationSettings> {

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
