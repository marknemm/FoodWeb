import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Donation, DonationClaimRequest } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DonationClaimService {

  readonly url = `${environment.server}/donation/claim`;

  constructor(
    protected _httpClient: HttpClient,
    protected _httpResponseService: HttpResponseService
  ) {}

  /**
   * Claims a given donation.
   * @param donation The donation that is to be claimed.
   * @return An observable that emits once the claim operation is completed on the server.
   */
  claimDonation(donation: Donation): Observable<Donation> {
    const request: DonationClaimRequest = { donationId: donation.id };
    return this._httpClient.post<Donation>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Donation successfully claimed' })
    );
  }

  /**
   * Unclaims a given donation.
   * @param donation The donation that is to be unclaimed.
   * @return An observable that emits once the unclaim operation is completed on the server.
   */
  unclaimDonation(donation: Donation): Observable<Donation> {
    const unclaimUrl = `${this.url}/${donation.id}`;
    return this._httpClient.delete<Donation>(unclaimUrl, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Donation successfully unclaimed' })
    );
  }
}
