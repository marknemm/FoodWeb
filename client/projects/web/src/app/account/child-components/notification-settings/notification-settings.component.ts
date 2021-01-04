import { Component, Input, OnInit } from '@angular/core';
import { AccountType, NotificationSettings } from '~shared';
import { NotificationSettingsForm } from '~web/account/forms/notification-settings.form';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-notifications-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent implements OnInit {

  @Convert()
  @Input() editable: boolean = false;
  @Input() formGroup: NotificationSettingsForm;
  @Input() notificationSettings: Partial<NotificationSettings>;
  @Input() accountType: AccountType;

  constructor() {}

  ngOnInit() {}

}
