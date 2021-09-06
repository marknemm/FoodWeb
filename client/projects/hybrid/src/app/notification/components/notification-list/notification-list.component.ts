import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListResponse, Notification, NotificationReadRequest } from '~shared';
import { NotificationListComponent as WebNotificationListComponent } from '~web/notification/components/notification-list/notification-list.component';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-hybrid-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent extends WebNotificationListComponent {

  constructor(
    public notificationService: NotificationService,
    public pageTitleService: PageTitleService,
    protected _activatedRoute: ActivatedRoute,
    protected _urlQueryService: UrlQueryService,
    private _authenticationService: AuthenticationService,
  ) {
    super(notificationService, pageTitleService, _activatedRoute, _urlQueryService);
    // Clear notifications on logout, since this component will not leave view or re-initialize upon leaving page.
    this._authenticationService.logout$.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => this._notifications = []);
  }

  ionViewWillEnter(): void {
    // If no notifications are present, then refresh upon (re)opening this page.
    if (!this._notifications?.length) {
      this.refresh().subscribe();
    }
  }

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
    console.log('Refreshing!');
    return super.refresh(request);
  }
}
