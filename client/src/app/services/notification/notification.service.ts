import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, catchError, finalize } from 'rxjs/operators';
import { PageProgressService } from '../page-progress/page-progress.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { Notification } from '../../../../../shared/src/interfaces/notification/notification';
import { ListResponse } from '../../../../../shared/src/interfaces/list-response';
import { NotificationReadRequest, NotificationReadFilters } from '../../../../../shared/src/interfaces/notification/notification-read-request';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly url = '/server/notification'

  constructor(
    private _httpClient: HttpClient,
    private _pageProgressService: PageProgressService,
    private _errorHandlerService: ErrorHandlerService
  ) {}

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
    const request = <NotificationReadRequest>filters;
    request.page = (page >= 0 ? page : request.page);
    request.limit = (limit >= 0 ? limit : request.limit);
    const params = new HttpParams({ fromObject: <any>request });
    this._pageProgressService.activate(true);
    return this._httpClient.get<ListResponse<Notification>>(this.url, { params }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
