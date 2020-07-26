import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Donation, DonationSaveData, DonationSaveRequest } from '~shared';
import { environment } from '~web/../environments/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
export { Donation };

@Injectable({
  providedIn: 'root'
})
export class DonationSaveService {

  /**
   * The REST endpoint URL for a donation resource.
   */
  readonly url = `${environment.server}/donation`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  /**
   * Creates (saves) a new donation on the server.
   * @param donation The donation to create on the server.
   * @return An observable that emits the newly saved donation when the server response returns.
   */
  createDonation(donation: DonationSaveData): Observable<Donation> {
    const createRequest: DonationSaveRequest = { donationSaveData: donation };
    return this._httpClient.post<Donation>(this.url, createRequest, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Donation successful' })
    );
  }

  /**
   * Updates a given donation on the server.
   * @param originalDonation The original donation that is to be updated.
   * @param donationSaveData The donation update/save data.
   * @return An observable that emits the updated donation when the server response returns.
   */
  updateDonation(originalDonation: Donation, donationSaveData: DonationSaveData): Observable<Donation> {
    const updateRequest: DonationSaveRequest = this._genDonationUpdateRequest(originalDonation, donationSaveData);
    return this._httpClient.put<Donation>(this.url, updateRequest, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Donation update successful' })
    );
  }

  private _genDonationUpdateRequest(originalDonation: Donation, donationSaveData: DonationSaveData): DonationSaveRequest {
    const donation: Donation = Object.assign({}, originalDonation);
    Object.keys(donationSaveData).forEach((property: string) =>
      donation[property] = donationSaveData[property]
    );
    return { donationSaveData: donation };
  }
}
