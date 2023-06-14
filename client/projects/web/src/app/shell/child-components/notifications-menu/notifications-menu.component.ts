import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { switchMap } from 'rxjs/operators';
import { ListResponse } from '~shared';
import { Notification, NotificationService } from '~web/notification/services/notification/notification.service';
import { DestroyService } from '~web/shared/services/destroy/destroy.service';

@Component({
  selector: 'foodweb-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
  providers: [DestroyService]
})
export class NotificationsMenuComponent implements OnInit {

  readonly faCog = faCog;

  private _previewNotifications: Notification[] = [];

  constructor(
    public notificationService: NotificationService,
    private _destroyService: DestroyService
  ) {}

  get previewNotifications(): Notification[] {
    return this._previewNotifications;
  }

  ngOnInit(): void {
    this.notificationService.listenNewNotifications().pipe(
      this._destroyService.untilDestroy(),
      switchMap(() => this.notificationService.getNotifications({ limit: 10 }, { showLoader: false }))
    ).subscribe(
      (response: ListResponse<Notification>) => this._previewNotifications = response.list
    );
  }

  refreshUnseenNotifications(): void {
    if (this._previewNotifications?.length) {
      this.notificationService.refreshUnseenNotifications(this._previewNotifications[0].id, true);
    }
  }
}
