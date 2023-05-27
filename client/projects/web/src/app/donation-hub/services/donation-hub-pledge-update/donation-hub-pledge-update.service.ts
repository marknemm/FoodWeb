import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
import { DonationHubPledge } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class DonationHubPledgeUpdateService {

  readonly url = `${environment.server}/donation-hub/pledge`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  updateDonationHubPledge(donationHubPledge: DonationHubPledge): Observable<DonationHubPledge> {
    const updateUrl = `${this.url}/${donationHubPledge.id}`;
    return this._httpClient.put<DonationHubPledge>(updateUrl, donationHubPledge, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(this.updateDonationHubPledge, {
        successMessage: 'Donation Hub Pledge Successfully Updated'
      })
    );
  }
}
