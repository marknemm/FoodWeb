import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponse, Notification, NotificationReadRequest } from '~shared';
import { NotificationsComponent as WebNotificationsComponent } from '~web/notification/components/notifications/notifications.component';

@Component({
  selector: 'foodweb-hybrid-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends WebNotificationsComponent {

  private _page = 1;

  get page(): number {
    return this._page;
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Notification List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this._page = event.page;
    this.notificationService.getNotifications({ page: event.page }).subscribe(
      (response: ListResponse<Notification>) => {
        if (response?.list) {
          for (const notification of response.list) {
            this._notifications.push(notification); // Must iteratively add in-place so no blink in ion-virtual-scroll.
          }
          this._totalCount = response.totalCount;
        }
        event.target.complete();
      }
    );
  }

  /**
   * Handles an ionRefresh event by refreshing the Notification List items.
   * @param event The ionRefresh event.
   */
  handleRefresh(event: any): void {
    this.refresh().subscribe(() => event.target.complete());
  }

  refresh(request: NotificationReadRequest = {}): Observable<Notification[]> {
    this._page = 1;
    return super.refresh(request);
  }
}
