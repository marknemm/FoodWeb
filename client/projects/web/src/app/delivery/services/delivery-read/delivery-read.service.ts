import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Donation, DonationReadRequest, ListResponse } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

/**
 * A service responsible for reading (donation) deliveries from the server.
 * Note that a delivery is contained within a donation, and the entire donation is retrieved.
 */
@Injectable({
  providedIn: 'root'
})
export class DeliveryReadService {

  /**
   * The REST endpoint URL for a delivery resource.
   */
  readonly url = `${environment.server}/delivery`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
    private _router: Router
  ) {}

  /**
   * Whether or not a delivery read request is loading.
   */
  get loading(): boolean {
    return this._httpResponseService.loading;
  }

  /**
   * Gets a list of (donation) deliveries from the server based off of a given donation read request.
   * If it is detected that the user is on a `/my` route, then their deliveries will be retrieved.
   * If it is detected that the user is on a `/unscheduled` route, then only unscheduled deliveries will be retrieved.
   * @param request The donation read request containing filter, pagination, and sorting parameters for the retrieval.
   * @return An observable that emits a list response containing the retrieved (donation) deliveries.
   */
  getDeliveries(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    return (this._router.url.indexOf('my') >= 0)
      ? this.getMyDeliveries(request)
      : (this._router.url.indexOf('unscheduled') >= 0)
        ? this.getUnscheduledDeliveries(request)
        : this._getDeliveries(request);
  }

  /**
   * Gets a list of the user's (donation) deliveries from the server based off of a given donation read request.
   * @param request The donation read request containing filter, pagination, and sorting parameters for the retrieval.
   * @return An observable that emits a list response containing the retrieved (donation) deliveries belonging to the current user.
   */
  getMyDeliveries(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    return this._getDeliveries(request, '/my');
  }

  /**
   * Gets a list of unscheduled (donation) deliveries from the server based off of a given donation read request.
   * @param request The donation read request containing filter, pagination, and sorting parameters for the retrieval.
   * @return An observable that emits a list response containing the retrieved unscheduled (donation) deliveries.
   */
  getUnscheduledDeliveries(request: DonationReadRequest): Observable<ListResponse<Donation>> {
    return this._getDeliveries(request, '/unscheduled');
  }

  /**
   * Gets a list of (donation) deliveries from the server based off of a given donation read request.
   * @param request The donation read request containing filter, pagination, and sorting parameters for the retrieval.
   * @param subRoute The optional sub-route that is to be used for delivery retrieval (can be `/my` or `/unscheduled`).
   * @return An observable that emits a list response containing the retrieved (donation) deliveries.
   */
  private _getDeliveries(request: DonationReadRequest, subRoute: '/my' | '/unscheduled' | '' = ''): Observable<ListResponse<Donation>> {
    const getUrl: string = (this.url + subRoute);
    request.page = request.page ? request.page : 1;
    request.limit = request.limit ? request.limit : 10;
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Donation>>(getUrl, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }
}
