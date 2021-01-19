import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationHubPledge } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DonationHubPledgeCreateService {

  readonly url = `${environment.server}/donation-hub/:id/pledge`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  createDonationPledge(donationHubPledge: DonationHubPledge, donationHubId: number): Observable<DonationHubPledge> {
    const postUrl: string = this.url.replace('/:id/', `/${donationHubId}/`);
    return this._httpClient.post<DonationHubPledge>(postUrl, donationHubPledge, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Donation Hub Successfully Created' })
    );
  }
}
