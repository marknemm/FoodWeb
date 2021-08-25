import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListResponse, Notification, NotificationReadRequest } from '~shared';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @Input() notificationsMenu = false;

  protected _notifications: Notification[] = [];
  protected _totalCount = 0;

  constructor(
    public notificationService: NotificationService,
    public pageTitleService: PageTitleService,
    protected _activatedRoute: ActivatedRoute,
    protected _urlQueryService: UrlQueryService,
  ) {}

  get notifications(): Notification[] {
    return this._notifications;
  }

  get totalCount(): number  {
    return this._totalCount;
  }

  ngOnInit() {
    this.pageTitleService.title = 'Notifications';
    // Only listen for query parameter changes if we are on notifications page (not a menu off of header).
    if (!this.notificationsMenu) {
      this._urlQueryService.listenQueryParamsChange<NotificationReadRequest>(this._activatedRoute).subscribe(
        (request: NotificationReadRequest) => this.refresh(request).subscribe()
      );
    }
  }

  refresh(request: NotificationReadRequest = {}): Observable<Notification[]> {
    return this.notificationService.getNotifications(request).pipe(
      map((response: ListResponse<Notification>) => {
        if (response) {
          this._notifications = response.list;
          this._totalCount = response.totalCount;
        }
        return this._notifications;
      })
    );
  }

}
