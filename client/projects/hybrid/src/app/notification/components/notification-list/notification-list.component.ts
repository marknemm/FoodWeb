import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notification } from '~shared';
import { NotificationFiltersForm } from '~web/notification/forms/notification-filters.form';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  providers: [ListQueryService]
})
export class NotificationListComponent implements OnDestroy {

  readonly notificationFilters = new NotificationFiltersForm();

  @ViewChild(IonContent, { static: true }) ionContent: IonContent;

  private _destroy$ = new Subject();

  constructor(
    public listQueryService: ListQueryService<Notification>,
    public notificationService: NotificationService,
    private _authenticationService: AuthenticationService,
  ) {
    // Clear notifications on logout, since this component will not leave view or re-initialize upon leaving page.
    this._authenticationService.logout$.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => this.listQueryService.clear());
  }

  ionViewWillEnter(): void {
    // If no notifications are present, then refresh upon (re)opening this page.
    if (!this.listQueryService.items?.length) {
      this.listQueryService.load(
        this.notificationService.getNotifications.bind(this.notificationService),
        this.notificationFilters
      );
    }
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Notification List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.listQueryService.loadMore().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionRefresh event by refreshing the Notification List items.
   * @param event The ionRefresh event.
   */
  handleRefresh(event: any): void {
    this.listQueryService.refresh({ showLoader: false }).subscribe(() => event.target.complete());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
