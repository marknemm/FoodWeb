import { Component, OnInit } from '@angular/core';
import { Notification } from '~shared';
import { NotificationFiltersForm } from '~web/notification/forms/notification-filters.form';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  providers: [ListQueryService]
})
export class NotificationListComponent implements OnInit {

  readonly notificationFilters = new NotificationFiltersForm();

  constructor(
    public listQueryService: ListQueryService<Notification>,
    public notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.listQueryService.load(
      this.notificationService.getNotifications.bind(this.notificationService),
      this.notificationFilters
    );
  }

}
