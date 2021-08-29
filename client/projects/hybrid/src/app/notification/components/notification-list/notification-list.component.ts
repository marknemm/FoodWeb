import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponse, Notification, NotificationReadRequest } from '~shared';
import { NotificationListComponent as WebNotificationListComponent } from '~web/notification/components/notification-list/notification-list.component';

@Component({
  selector: 'foodweb-hybrid-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent extends WebNotificationListComponent {

  /**
   * Handles an ionInfinite event by loading the next segment of Notification List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.activeFilters.page = event.page;
    this.notificationService.getNotifications(this.activeFilters).subscribe(
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

  refresh(request: NotificationReadRequest = this.activeFilters): Observable<Notification[]> {
    this.activeFilters.page = 1;
    return super.refresh(request);
  }
}
