import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~admin/environments/environment';
import { AdminDonationSaveRequest, Donation } from '~shared';
import { HttpResponseService } from '~web/shared/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDonationSaveService {

  readonly url = `${environment.server}/donation`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  createDonation(donation: Donation, sendNotifications: boolean): Observable<Donation> {
    const request: AdminDonationSaveRequest = { donation, sendNotifications };
    return this._httpClient.post<Donation>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

}
