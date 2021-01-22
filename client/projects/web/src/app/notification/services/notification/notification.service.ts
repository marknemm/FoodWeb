import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import {
  LastSeenNotificationUpdateRequest, ListResponse, Notification,
  NotificationReadRequest, NotificationsAvailableEvent,
  NotificationUpdateRequest,
  ServerSentEventType
} from '~shared';
import { environment } from '~web-env/environment';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { ServerSentEventSourceService } from '~web/notification/services/server-sent-event-source/server-sent-event-source.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
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
    private _alertQueueService: AlertQueueService,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService,
    private _router: Router,
    private _sseSourceService: ServerSentEventSourceService
  ) {
    this._listenForUnseenNotifications();
    this._authService.login$.subscribe(() => this._getNotificationsPreview());
    this._authService.logout$.subscribe(() => this._clearNotificationsData());
  }

  get unseenNotificationsCount(): number {
    return this._unseenNotificationsCount;
  }

  get notificationsPreview(): Notification[] {
    return this._notificationsPreview;
  }

  private _getNotificationsPreview(): void {
    this._getNotifications({}, 1, 10).subscribe((notificationsResponse: ListResponse<Notification>) =>
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
      this._getNotifications({}, 1, 10).subscribe((notificationsResponse: ListResponse<Notification>) =>
        this._notificationsPreview = notificationsResponse.list
      );
    });
  }

  listenNotificationsQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Notification>> {
    return activatedRoute.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        const filters: NotificationReadRequest = {};
        params.keys.forEach((paramKey: string) => {
          if (paramKey !== 'page' && paramKey !== 'limit') {
            filters[paramKey] = params.get(paramKey);
          }
        });
        const page: number = (params.has('page') ? parseInt(params.get('page'), 10) : undefined);
        const limit: number = (params.has('limit') ? parseInt(params.get('limit'), 10) : undefined);
        return this.getNotifications(filters, page, limit);
      })
    );
  }

  getNotifications(filters: NotificationReadRequest, page: number, limit: number): Observable<ListResponse<Notification>> {
    this._pageProgressService.activate(true);
    return this._getNotifications(filters, page, limit);
  }

  private _getNotifications(request: NotificationReadRequest, page: number, limit: number): Observable<ListResponse<Notification>> {
    request.page = (page >= 0 ? page : 1);
    request.limit = (limit >= 0 ? limit : 10);
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Notification>>(this.url, { params, withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._alertQueueService.add(err)),
      finalize(() => this._pageProgressService.reset())
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
        catchError((err: HttpErrorResponse) => this._alertQueueService.add(err))
      ).subscribe();
    }
  }

  updateNotificationReadState(notification: Notification, read: boolean): void {
    if (notification.read !== read) {
      notification.read = read;
      this._updateNotification(notification);
    }
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
        catchError((err: HttpErrorResponse) => this._alertQueueService.add(err))
      ).subscribe();
  }
}
