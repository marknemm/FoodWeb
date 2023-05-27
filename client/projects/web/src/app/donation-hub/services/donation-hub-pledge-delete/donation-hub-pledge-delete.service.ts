import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationHubPledge } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DonationHubPledgeDeleteService {

  readonly url = `${environment.server}/donation-hub/pledge`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  /**
   * Deletes a given donation hub pledge on the server.
   * @param pledge The `DonationHubPledge` that is to be deleted.
   * @return An observable that emits once the delete operation completes.
   */
  deleteDonationPledge(pledge: DonationHubPledge): Observable<void> {
    const deleteUrl = `${this.url}/${pledge.id}`;
    return this._httpClient.delete(deleteUrl, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse(this.deleteDonationPledge, {
        successMessage: 'Donation Hub Pledge Successfully Deleted'
      })
    );
  }
}
