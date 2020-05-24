import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDonationForm } from '~admin/admin-donation/forms/admin-donation.form';
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

  createDonation(donationForm: AdminDonationForm): Observable<Donation> {
    const request: AdminDonationSaveRequest = this._genDonationSaveRequest(donationForm);
    return this._httpClient.post<Donation>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

  private _genDonationSaveRequest(donationForm: AdminDonationForm): AdminDonationSaveRequest {
    return {
      donation: donationForm.getDonation(),
      donorAccountId: donationForm.donorAccount.id,
      claimSaveReq: {
        donationId: null,
        receiverAccountId: donationForm.receiverAccount?.id,
        sendNotifications: donationForm.sendNotifications
      },
      deliverySaveReq: {
        donationId: null,
        volunteerAccountId: donationForm.volunteerAccount?.id,
        pickupWindow: donationForm.delivery?.pickupWindow,
        startTime: donationForm.delivery?.startTime,
        pickupTime: donationForm.delivery?.pickupTime,
        dropOffTime: donationForm.delivery?.dropOffTime,
        sendNotifications: donationForm.sendNotifications
      },
      sendNotifications: donationForm.sendNotifications
    };
  }

}
