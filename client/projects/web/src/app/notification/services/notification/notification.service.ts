import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { LastSeenNotificationUpdateRequest, ListResponse, Notification, NotificationReadRequest, NotificationsAvailableEvent, NotificationUpdateRequest, ServerSentEventType } from '~shared';
import { environment } from '~web-env/environment';
import { ServerSentEventSourceService } from '~web/notification/services/server-sent-event-source/server-sent-event-source.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly url = `${environment.server}/notification`;

  private _notificationsPreview: Notification[] = [];
  private _unseenNotificationsCount = 0;

  constructor(
    private _authService: AuthenticationService,
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _pageProgressService: PageProgressService,
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

  get notificationsPreview(): Notification[] {
    return this._notificationsPreview;
  }

  get unseenNotificationsCount(): number {
    return this._unseenNotificationsCount;
  }

  private _getNotificationsPreview(): void {
    this._getNotifications({}).subscribe((notificationsResponse: ListResponse<Notification>) =>
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
      this._getNotifications({}).subscribe((notificationsResponse: ListResponse<Notification>) =>
        this._notificationsPreview = notificationsResponse.list
      );
    });
  }

  getNotifications(request: NotificationReadRequest): Observable<ListResponse<Notification>> {
    this._pageProgressService.activate(true);
    if (request instanceof ActivatedRoute) {
      request = this._getNotificationReadRequest(request.snapshot.paramMap);
    }
    return this._getNotifications(<NotificationReadRequest>request).pipe(
      finalize(() => this._pageProgressService.deactivate())
    );
  }

  private _getNotificationReadRequest(params: ParamMap): NotificationReadRequest {
    const request: NotificationReadRequest = {};
    params.keys.forEach((paramKey: string) => {
      if (paramKey !== 'page' && paramKey !== 'limit') {
        request[paramKey] = params.get(paramKey);
      }
    });
    request.page = (params.has('page') ? parseInt(params.get('page'), 10) : undefined);
    request.limit = (params.has('limit') ? parseInt(params.get('limit'), 10) : undefined);
    return request;
  }

  private _getNotifications(request: NotificationReadRequest): Observable<ListResponse<Notification>> {
    request.page = (request.page >= 0 ? request.page : 1);
    request.limit = (request.limit >= 0 ? request.limit : 10);
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Notification>>(this.url, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ showPageProgressOnLoad: false })
    );
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

  updateNotificationReadState(notification: Notification, read: boolean): void {
    if (notification.read !== read) {
      notification.read = read;
      this._updateNotification(notification);
    }
  }

  toggleNotificationFlaggedState(notification: Notification): void {
    this.updateNotificationFlaggedState(notification, !notification.flagged);
  }

  updateNotificationFlaggedState(notification: Notification, flagged: boolean): void {
    if (notification.flagged !== flagged) {
      notification.flagged = flagged;
      this._updateNotification(notification);
    }
  }

  private _updateNotification(notification: Notification): void {
    const notificationUpdateRequest: NotificationUpdateRequest = { notification };
      this._httpClient.put(this.url, notificationUpdateRequest, { withCredentials: true }).pipe(
        this._httpResponseService.handleHttpResponse({ pageProgressBlocking: false })
      ).subscribe();
  }
}
