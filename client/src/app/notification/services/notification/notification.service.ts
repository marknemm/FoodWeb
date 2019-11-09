import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PageProgressService } from '../../../shared/services/page-progress/page-progress.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler/error-handler.service';
import { ServerSentEventSourceService } from '../server-sent-event-source/server-sent-event-source.service';
import { SessionService } from '../../../session/services/session/session.service';
import { Notification } from '../../../../../../shared/src/interfaces/notification/notification';
import { ListResponse } from '../../../../../../shared/src/interfaces/list-response';
import { NotificationReadRequest, NotificationReadFilters } from '../../../../../../shared/src/interfaces/notification/notification-read-request';
import { NotificationUpdateRequest } from '../../../../../../shared/src/interfaces/notification/notification-update-request';
import { LastSeenNotificationUpdateRequest } from '../../../../../../shared/src/interfaces/notification/last-seen-notification-update-request';
import { ServerSentEventType, NotificationsAvailableEvent } from '../../../../../../shared/src/interfaces/server-sent-event/server-sent-event';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly url = `${environment.server}/notification`;

  private _unseenNotificationsCount = 0;
  private _notificationsPreview: Notification[] = [];

  constructor(
    private _router: Router,
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService,
    private _errorHandlerService: ErrorHandlerService,
    private _sseSourceService: ServerSentEventSourceService,
    private _sessionService: SessionService
  ) {
    this._listenForUnseenNotifications();
    this._sessionService.login$.subscribe(() => this._getNotificationsPreview());
    this._sessionService.logout$.subscribe(() => this._clearNotificationsData());
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
      this._getNotifications({}, 1, 10).subscribe((notificationsResponse: ListResponse<Notification>) => {
        this._notificationsPreview = notificationsResponse.list
      });
    });
  }

  listenNotificationsQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Notification>> {
    return activatedRoute.queryParamMap.pipe(
      flatMap((params: ParamMap) => {
        const filters: NotificationReadFilters = {};
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

  getNotifications(filters: NotificationReadFilters, page: number, limit: number): Observable<ListResponse<Notification>> {
    this._pageProgressService.activate(true);
    return this._getNotifications(filters, page, limit);
  }

  private _getNotifications(filters: NotificationReadFilters, page: number, limit: number): Observable<ListResponse<Notification>> {
    const request = <NotificationReadRequest>filters;
    request.page = (page >= 0 ? page : 1);
    request.limit = (limit >= 0 ? limit : 10);
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Notification>>(this.url, { params, withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
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
        catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err))
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
        catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err))
      ).subscribe();
  }
}
