import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LastSeenNotificationUpdateRequest, ListResponse, Notification, NotificationReadRequest, NotificationsAvailableEvent, NotificationUpdateRequest, ServerSentEventType } from '~shared';
import { environment } from '~web-env/environment';
import { ServerSentEventSourceService } from '~web/notification/services/server-sent-event-source/server-sent-event-source.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly defaultReadLimit = 25;
  readonly url = `${environment.server}/notification`;

  private _notificationsPreview: Notification[] = [];
  private _unseenNotificationsCount = 0;

  constructor(
    private _authService: AuthenticationService,
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _router: Router,
    private _sseSourceService: ServerSentEventSourceService
  ) {
    this._listenForUnseenNotifications();
    this._authService.login$.subscribe(() => this._getNotificationsPreview());
    this._authService.logout$.subscribe(() => this._clearNotificationsData());
  }

  get hasUnseenNotifications(): boolean {
    return (this._unseenNotificationsCount > 0);
  }

  get loading(): boolean {
    return this._httpResponseService.loading;
  }

  get notificationsPreview(): Notification[] {
    return this._notificationsPreview;
  }

  get unseenNotificationsCount(): number {
    return this._unseenNotificationsCount;
  }

  public getNotifications(request: NotificationReadRequest, showPageProgressOnLoad = true): Observable<ListResponse<Notification>> {
    request.page = (request.page >= 0 ? request.page : 1);
    request.limit = (request.limit >= 0 ? request.limit : this.defaultReadLimit);
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Notification>>(this.url, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ showPageProgressOnLoad })
    );
  }

  private _getNotificationsPreview(): void {
    this.getNotifications({}, false).subscribe((notificationsResponse: ListResponse<Notification>) =>
      this._notificationsPreview = notificationsResponse.list
    );
  }

  private _clearNotificationsData(): void {
    this._notificationsPreview = [];
    this._unseenNotificationsCount = 0;
  }

  private _listenForUnseenNotifications(): void {
    this._sseSourceService.onMessageType<NotificationsAvailableEvent>(
      ServerSentEventType.NotificationsAvailable
    ).subscribe((notificationsAvailableEvent) => {
      this._unseenNotificationsCount = notificationsAvailableEvent.unseenNotificationsCount;
      this._getNotificationsPreview();
    });
  }

  handleNotificationSelect(notification: Notification): void {
    this.updateNotificationReadState(notification, true);
    if (notification.notificationLink) {
      this._router.navigateByUrl(notification.notificationLink);
    }
  }

  updateSeenNotifications(): void {
    if (this._unseenNotificationsCount > 0) {
      this._unseenNotificationsCount = 0;
      const lastSeenNotificationUpdateReq: LastSeenNotificationUpdateRequest = {
        lastSeenNotificationId: this._notificationsPreview[0].id
      };
      this._httpClient.put(`${this.url}/last-seen-notification`, lastSeenNotificationUpdateReq, { withCredentials: true }).pipe(
        this._httpResponseService.handleHttpResponse({ pageProgressBlocking: false })
      ).subscribe();
    }
  }

  toggleNotificationFlaggedState(notification: Notification): void {
    this.updateNotificationFlaggedState(notification, !notification.flagged);
  }

  updateNotificationFlaggedState(notification: Notification, flagged: boolean): void {
    if (notification.flagged !== flagged) {
      notification.flagged = flagged;
      this._updateNotificationState(notification);
    }
  }

  updateNotificationReadState(notification: Notification, read: boolean): void {
    if (notification.read !== read) {
      notification.read = read;
      this._updateNotificationState(notification);
    }
  }

  private _updateNotificationState(notification: Notification): void {
    const notificationUpdateRequest: NotificationUpdateRequest = { notification };
      this._httpClient.put(this.url, notificationUpdateRequest, { withCredentials: true }).pipe(
        this._httpResponseService.handleHttpResponse({ pageProgressBlocking: false })
      ).subscribe();
  }
}
