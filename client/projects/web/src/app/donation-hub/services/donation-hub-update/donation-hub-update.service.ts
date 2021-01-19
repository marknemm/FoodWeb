import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationHub } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DonationHubUpdateService {

  readonly url = `${environment.server}/donation-hub`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  updateDonationHub(donationHub: DonationHub): Observable<DonationHub> {
    const updateUrl = `${this.url}/${donationHub.id}`;
    return this._httpClient.put<DonationHub>(updateUrl, donationHub, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Donation Hub Successfully Updated' })
    );
  }
}
