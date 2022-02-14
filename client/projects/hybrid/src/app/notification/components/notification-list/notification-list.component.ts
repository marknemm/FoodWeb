import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class NotificationListComponent implements OnInit, OnDestroy {

  readonly notificationFilters = new NotificationFiltersForm();

  @ViewChild(IonContent, { static: true }) ionContent: IonContent;

  private readonly _destroy$ = new Subject();

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

  ngOnInit(): void {
    // If no notifications are present, then refresh upon (re)opening this page.
    if (!this.listQueryService.items?.length) {
      this.listQueryService.load(
        this.notificationService.getNotifications.bind(this.notificationService),
        this.notificationFilters
      );
    }
  }

  ionViewWillEnter(): void {
    this.ngOnInit(); // Re-initialize when view (re)enters; ngOnInit may not get called each time if component preserved in background.
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
