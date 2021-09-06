import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LastSeenNotificationUpdateRequest, ListResponse, Notification, NotificationReadRequest, NotificationsAvailableEvent, NotificationUpdateRequest, ServerSentEventType } from '~shared';
import { environment } from '~web-env/environment';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
import { ServerSentEventService } from '~web/shared/services/server-sent-event/server-sent-event.service';
export { Notification };

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly defaultReadLimit = 25;
  readonly url = `${environment.server}/notification`;

  private _unseenNotificationsCount = 0;

  constructor(
    private _authService: AuthenticationService,
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _router: Router,
    private _sessionService: SessionService,
    private _sseService: ServerSentEventService,
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
   * Whether or not unseen notifications exist.
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
    // Set defaults for pagination.
    request.page = (request.page >= 1 ? request.page : 1);
    request.limit = (request.limit >= 0 ? request.limit : this.defaultReadLimit);

    // Check if unseen notifications count should be reset (getting fresh first page with no special filters).
    request.resetUnseenNotifications = (request.page === 1);
    for (const key in request) {
      request.resetUnseenNotifications = request.resetUnseenNotifications
        && (key === 'resetUnseenNotifications' || key === 'maxId' || key === 'latestTimestamp' || key === 'page' || key === 'limit');
      if (!request.resetUnseenNotifications) break;
    }
    if (request.resetUnseenNotifications) {
      this._unseenNotificationsCount = 0;
    }

    // Send GET request for notifications.
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Notification>>(this.url, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ showPageProgressOnLoad })
    );
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

    return this._sseService.onMessageType<NotificationsAvailableEvent>(
      ServerSentEventType.NotificationsAvailable
    ).pipe(
      map((notificationsAvailableEvent) =>
        this._unseenNotificationsCount = notificationsAvailableEvent.unseenNotificationsCount
      )
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
   * @param lastSeenNotificationId The ID of the last seen notification.
   * @param resetImmediately Set to true if the unseenNotificationsCount should be set to 0 immediately instead
   * of waiting for the updated count from the server.
   */
  refreshUnseenNotifications(lastSeenNotificationId: number, resetImmediately = false): void {
    if (this._unseenNotificationsCount > 0) {
      if (resetImmediately) {
        this._unseenNotificationsCount = 0;
      }
      const request: LastSeenNotificationUpdateRequest = { lastSeenNotificationId };
      this._httpClient.put<number>(`${this.url}/last-seen-notification`, request, { withCredentials: true }).pipe(
        this._httpResponseService.handleHttpResponse<number>({ pageProgressBlocking: false })
      ).subscribe(
        (unseenNotificationsCount: number) => this._unseenNotificationsCount = unseenNotificationsCount
      );
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
