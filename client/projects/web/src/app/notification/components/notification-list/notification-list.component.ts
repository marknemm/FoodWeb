import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListResponse, Notification, NotificationReadRequest } from '~shared';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit, OnDestroy {

  protected _activeFilters: NotificationReadRequest = { page: 1 };
  protected _destroy$ = new Subject();
  protected _notifications: Notification[] = [];
  protected _totalCount = 0;

  constructor(
    public notificationService: NotificationService,
    public pageTitleService: PageTitleService,
    protected _activatedRoute: ActivatedRoute,
    protected _urlQueryService: UrlQueryService,
  ) {}

  get activeFilters(): NotificationReadRequest {
    return this._activeFilters;
  }

  get loading(): boolean {
    return this.notificationService.loading;
  }

  get notifications(): Notification[] {
    return this._notifications;
  }

  get totalCount(): number  {
    return this._totalCount;
  }

  ngOnInit(): void {
    this.pageTitleService.title = 'Notifications';

    // Only listen for query parameter changes if we are on notifications page (not a menu off of header).
    this._urlQueryService.listenQueryParamsChange<NotificationReadRequest>(this._activatedRoute).subscribe(
      (request: NotificationReadRequest) => this.refresh(request).subscribe()
    );
  }

  /**
   * Refreshes the Notification List items.
   * @param request The optional Read Request, containing filter/sorting parameters.
   * If not given, will use the last recorded Read Request parameters.
   * @returns An observable that emits the loaded `Notification` items.
   */
  refresh(request: NotificationReadRequest = this.activeFilters): Observable<Notification[]> {
    this._activeFilters = request;
    return this.notificationService.getNotifications(this.activeFilters).pipe(
      map((response: ListResponse<Notification>) => {
        if (response) {
          this._notifications = response.list;
          this._totalCount = response.totalCount;
        }
        return this._notifications;
      })
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

}
