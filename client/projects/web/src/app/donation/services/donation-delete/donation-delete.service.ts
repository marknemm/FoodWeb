import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Donation } from '~shared';
import { environment } from '~web-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DonationDeleteService {

  readonly url = `${environment.server}/donation`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  /**
   * Deletes a given donation.
   * @param donation The donation that is to be deleted.
   * @return An observable that emits once the delete operation is completed on the server.
   */
  deleteDonation(donation: Donation): Observable<void> {
    const deleteUrl = `${this.url}/${donation.id}`;
    return this._httpClient.delete(deleteUrl, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({ successMessage: 'Donation deletion successful' })
    );
  }
}
