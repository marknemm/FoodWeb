import { Component, OnInit } from '@angular/core';
import { Notification } from '~shared';
import { NotificationFilterForm, NotificationFilterFormAdapter } from '~web/notification/services/notification-filter-form-adapter/notification-filter-form-adapter.service';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  providers: [ListQueryService]
})
export class NotificationListComponent implements OnInit {

  readonly notificationFilters: NotificationFilterForm = this._notificationFilterFormAdapter.toForm();

  constructor(
    private _listQueryService: ListQueryService<Notification>,
    private _notificationFilterFormAdapter: NotificationFilterFormAdapter,
    private _notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this._listQueryService.load(
      this._notificationService.getNotifications.bind(this._notificationService),
      this.notificationFilters,
      this._notificationFilterFormAdapter
    );
  }

  get notifications(): readonly Notification[] {
    return this._listQueryService.items;
  }

  get pageSizeOptions(): number[] {
    return [
      this._notificationService.defaultReadLimit,
      this._notificationService.defaultReadLimit * 2,
      this._notificationService.defaultReadLimit * 4
    ];
  }

  get totalCount(): number {
    return this._listQueryService.totalCount;
  }

  handleNotificationFlagToggle(notification: Notification): void {
    this._notificationService.toggleNotificationFlaggedState(notification);
  }

  handleNotificationSelect(notification: Notification): void {
    this._notificationService.handleNotificationSelect(notification);
  }

}
