import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { LastSeenNotificationUpdateRequest, ListResponse, Notification, NotificationReadRequest, NotificationsAvailableEvent, NotificationUpdateRequest, ServerSentEventType } from '~shared';
import { environment } from '~web-env/environment';
import { ServerSentEventSourceService } from '~web/notification/services/server-sent-event-source/server-sent-event-source.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
export { Notification };

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
    private _sessionService: SessionService,
    private _sseSourceService: ServerSentEventSourceService,
  ) {
    // Listen for changes in login status (will immediately get current status on first subscribe).
    this._authService.loginStatus$.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        // Upon login, listen for any SSE detailing new unseen notifications, and maintain unseen notification count.
        this.listenNewNotifications().subscribe(
          (unseenCount: number) => this._unseenNotificationsCount = unseenCount
        );
      } else {
        // Upon logout, clear unseen notifications count and stop listening for new notifications.
        this._unseenNotificationsCount = 0;
      }
    });
  }

  /**
   * Whether or not unseen notifiations exist.
   */
  get hasUnseenNotifications(): boolean {
    return (this._unseenNotificationsCount > 0);
  }

  /**
   * The loading state for notifications.
   */
  get loading(): boolean {
    return this._httpResponseService.loading;
  }

  /**
   * The count of unseen notifications.
   */
  get unseenNotificationsCount(): number {
    return this._unseenNotificationsCount;
  }

  /**
   * Gets notifications using a given read request.
   * @param request The read request containing filters, pagination, and sorting data for the notifications to retrieve.
   * @param showPageProgressOnLoad Set to false if no page progress indicator should show on load; defaults to true.
   * @returns An observable that emits a notifications list response on successful retrieval.
   */
  getNotifications(request: NotificationReadRequest, showPageProgressOnLoad = true): Observable<ListResponse<Notification>> {
    request.page = (request.page >= 1 ? request.page : 1);
    request.limit = (request.limit >= 0 ? request.limit : this.defaultReadLimit);
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Notification>>(this.url, { params, withCredentials: true }).pipe(
      tap((response: ListResponse<Notification>) => this._cacheNotificationsPage(response.list, request)),
      this._httpResponseService.handleHttpResponse({ showPageProgressOnLoad })
    );
  }

  private async _cacheNotificationsPage(notifications: Notification[], request: NotificationReadRequest): Promise<void> {
    const insertStartIdx = ((request.page - 1) * request.limit);
    const cacheableNotificationCount = (600 - insertStartIdx);
    let canCache = (cacheableNotificationCount > 0);
    for (const key in request) {
      canCache = canCache && (key === 'maxId' || key === 'latestTimestamp' || key === 'page' || key === 'limit');
      if (!canCache) break;
    }

    if (canCache) {
      notifications = notifications.slice(0, Math.min(cacheableNotificationCount, notifications.length));
      const cachedNotifications: Notification[] = await this._sessionService.sessionStore.get('notifications') ?? [];
      cachedNotifications.splice(insertStartIdx, 0, ...notifications);
      this._sessionService.sessionStore.set('notifications', cachedNotifications);
    }
  }

  /**
   * Listens for new notifications sent from the server via SSE.
   * Will automatically complete the returned observable once the user logs out.
   * @return An observable that emits the number of new notifications whenever more notifications are available.
   */
  listenNewNotifications(): Observable<number> {
    if (!this._sessionService.loggedIn) {
      return of(0); // If user is not logged in, then return that 0 notifications are available and complete.
    }

    return this._sseSourceService.onMessageType<NotificationsAvailableEvent>(
      ServerSentEventType.NotificationsAvailable
    ).pipe(
      takeUntil(this._authService.logout$), // Whenever logout occurs, stop listening for new notifications.
      map((notificationsAvailableEvent) => this._unseenNotificationsCount = notificationsAvailableEvent.unseenNotificationsCount)
    );
  }

  /**
   * Handles the selection of a given notification by routing to the resource that is associated with the notification.
   * @param notification The selected notification.
   */
  handleNotificationSelect(notification: Notification): void {
    this.updateNotificationReadState(notification, true);
    if (notification.notificationLink) {
      this._router.navigateByUrl(notification.notificationLink);
    }
  }

  /**
   * Updates the seen notifications by resetting the count of unseen notifications.
   */
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
