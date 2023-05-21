import { Component, Input } from '@angular/core';
import { AccountType, NotificationSettings } from '~shared';
import { NotificationSettingsForm } from '~web/account/services/notification-settings-form-adapter/notification-settings-form-adapter.service';

@Component({
  selector: 'foodweb-notifications-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent {

  @Input() editable = false;
  @Input() formGroup: NotificationSettingsForm;
  @Input() notificationSettings: Partial<NotificationSettings>;
  @Input() accountType: AccountType;

}
