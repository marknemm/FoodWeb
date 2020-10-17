import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '~admin-env/environment';
import { AdminDonationForm } from '~admin/admin-donation/forms/admin-donation.form';
import { AdminDonationSaveRequest, Donation } from '~shared';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDonationSaveService {

  readonly url = `${environment.server}/donation`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  /**
   * Creates a donation with data within a given donation creation form.
   * @param donationForm The donation creation form group.
   * @return An observable that resolves to the created donation once the server operation completes.
   */
  createDonation(donationForm: AdminDonationForm): Observable<Donation> {
    const request: AdminDonationSaveRequest = this._genDonationSaveRequest(donationForm);
    return this._httpClient.post<Donation>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

  /**
   * Updates a donation with data within a given donation update form.
   * @param donationForm The donation update form group.
   * @return An observable that resolves to theupdated donation once the server opeartion completes.
   */
  updateDonation(donationForm: AdminDonationForm): Observable<Donation> {
    const request: AdminDonationSaveRequest = this._genDonationSaveRequest(donationForm);
    return this._httpClient.put<Donation>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

  /**
   * Generates a donation save request from data within a given donation form.
   * @param donationForm The donation form group containing donation save data.
   * @return The generated donation save request.
   */
  private _genDonationSaveRequest(donationForm: AdminDonationForm): AdminDonationSaveRequest {
    return {
      donationSaveData: donationForm.getDonationSaveData(),
      donorAccountId: donationForm.donorAccount.id,
      claimSaveReq: {
        donationId: null,
        receiverAccountId: donationForm.receiverAccount?.id,
        sendNotifications: donationForm.sendNotifications
      },
      deliverySaveReq: {
        donationId: null,
        volunteerAccountId: donationForm.volunteerAccount?.id,
        delivery: donationForm.deliveryForm.toDeliverySaveData()
      },
      sendNotifications: donationForm.sendNotifications
    };
  }

}
