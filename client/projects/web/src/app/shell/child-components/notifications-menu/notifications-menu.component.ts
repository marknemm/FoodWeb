import { Component, OnDestroy, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ListResponse } from '~shared';
import { Notification, NotificationService } from '~web/notification/services/notification/notification.service';

@Component({
  selector: 'foodweb-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
})
export class NotificationsMenuComponent implements OnInit, OnDestroy {

  readonly faCog = faCog;

  private _destroy$ = new Subject();
  private _previewNotifications: Notification[] = [];

  constructor(
    public notificationService: NotificationService
  ) {}

  get previewNotifications(): Notification[] {
    return this._previewNotifications;
  }

  ngOnInit(): void {
    this.notificationService.listenNewNotifications().pipe(
      takeUntil(this._destroy$),
      switchMap(() => this.notificationService.getMany({ limit: 10 }, false))
    ).subscribe(
      (response: ListResponse<Notification>) => this._previewNotifications = response.list
    );
  }

  refreshUnseenNotifications(): void {
    if (this._previewNotifications?.length) {
      this.notificationService.refreshUnseenNotifications(this._previewNotifications[0].id, true);
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next(); // Cleanup RxJS subscription(s).
  }
}
