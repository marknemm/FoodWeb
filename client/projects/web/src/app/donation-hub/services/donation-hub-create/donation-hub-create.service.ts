import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationHub } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DonationHubCreateService {

  readonly url = `${environment.server}/donation-hub`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  createDonationHub(donationHub: DonationHub): Observable<DonationHub> {
    return this._httpClient.post<DonationHub>(this.url, donationHub, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(this.createDonationHub, { successMessage: 'Donation Hub Successfully Created' })
    );
  }
}
