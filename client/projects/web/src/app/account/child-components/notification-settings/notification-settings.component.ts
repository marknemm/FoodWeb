import { Component, Input, OnInit } from '@angular/core';
import { AccountType, NotificationSettings } from '~shared';
import { NotificationSettingsForm } from '~web/account/forms/notification-settings.form';

@Component({
  selector: 'foodweb-notifications-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroup: NotificationSettingsForm;
  @Input() notificationSettings: Partial<NotificationSettings>;
  @Input() accountType: AccountType;

  constructor() {}

  ngOnInit() {}

}
