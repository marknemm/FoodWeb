import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationHub } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DonationHubDeleteService {

  readonly url = `${environment.server}/donation-hub`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  /**
   * Deletes a given donation hub on the server.
   * @param donationHub The `DonationHub` that is to be deleted.
   * @return An observable that emits once the delete operation completes.
   */
  deleteDonationHub(donationHub: DonationHub): Observable<void> {
    const deleteUrl = `${this.url}/${donationHub.id}`;
    return this._httpClient.delete(deleteUrl, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(this.deleteDonationHub, { successMessage: 'Donation Hub Successfully Deleted' })
    );
  }
}
