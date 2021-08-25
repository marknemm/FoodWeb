import { Component } from '@angular/core';
import { ListLoadMoreEvent, ListRefreshEvent } from '~hybrid/filtered-list/interfaces/list-refresh-event';
import { ListResponse, Notification } from '~shared';
import { NotificationsComponent as WebNotificationsComponent } from '~web/notification/components/notifications/notifications.component';

@Component({
  selector: 'foodweb-hybrid-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends WebNotificationsComponent {

  /**
   * Handles an ionRefresh event by refreshing the Notification List items.
   * @param event The ionRefresh event.
   */
  handleListRefresh(event: ListRefreshEvent): void {
    this.refresh().subscribe(() => event.complete());
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Notification List items.
   * @param event The ionInfinite event.
   */
  handleListLoadMore(event: ListLoadMoreEvent): void {
    this.notificationService.getNotifications({ page: event.page }).subscribe(
      (response: ListResponse<Notification>) => {
        if (response?.list) {
          for (const notification of response.list) {
            this._notifications.push(notification); // Must iteratively add in-place so no blink in ion-virtual-scroll.
          }
          this._totalCount = response.totalCount;
        }
        event.complete();
      }
    );
  }
}
