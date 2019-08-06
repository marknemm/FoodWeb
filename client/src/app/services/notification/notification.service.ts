import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, catchError, finalize } from 'rxjs/operators';
import { PageProgressService } from '../page-progress/page-progress.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ServerSideEventSourceService } from '../server-side-event-source/server-side-event-source.service';
import { Notification } from '../../../../../shared/src/interfaces/notification/notification';
import { ListResponse } from '../../../../../shared/src/interfaces/list-response';
import { NotificationReadRequest, NotificationReadFilters } from '../../../../../shared/src/interfaces/notification/notification-read-request';
import { ServerSideEventType, NotificationsAvailableEvent } from '../../../../../shared/src/interfaces/server-side-event/server-side-event';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly url = '/server/notification'

  private _unseenNotificationsCount = 0;
  private _unseenNotificationsPreview: Notification[] = [];

  constructor(
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService,
    private _errorHandlerService: ErrorHandlerService,
    sseSourceService: ServerSideEventSourceService
  ) {
    this._listenForUnseenNotifications(sseSourceService);
  }

  get unseenNotificationsCount(): number {
    return this._unseenNotificationsCount;
  }

  get unseenNotificationsPreview(): Notification[] {
    return this._unseenNotificationsPreview;
  }

  private _listenForUnseenNotifications(sseSourceService: ServerSideEventSourceService): void {
    sseSourceService.onMessageType<NotificationsAvailableEvent>(
      ServerSideEventType.NotificationsAvailable
    ).subscribe((notificationsAvailableEvent) => {
      this._unseenNotificationsCount = notificationsAvailableEvent.unseenNotificationsCount;
      this._getNotifications({ unseen: true }, 1, 10).subscribe((notificationsResponse: ListResponse<Notification>) => {
        this._unseenNotificationsPreview = notificationsResponse.list
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
    return this._httpClient.get<ListResponse<Notification>>(this.url, { params }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
