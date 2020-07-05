import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Account, AccountType, AdminClaimSaveRequest, Donation } from '~shared';
import { AccountSelectConfig, AccountSelectDialogComponent } from '~web/account/account-select-dialog/account-select-dialog.component';
import { DonationClaimService } from '~web/donation/donation-claim/donation-claim.service';
import { HttpResponseService } from '~web/shared/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDonationClaimService extends DonationClaimService {

  constructor(
    protected _httpClient: HttpClient,
    protected _httpResponseService: HttpResponseService,
    private _matDialog: MatDialog
  ) {
    super(_httpClient, _httpResponseService);
  }

  /**
   * Claims a given donation.
   * @param donation The donation that is to be claimed.
   * @return An observable that emits once the claim operation is completed on the server.
   */
  claimDonation(donation: Donation): Observable<Donation> {
    return this._showSelectReceiverDialog().pipe(
      switchMap((receiverAccount: Account) =>
        (receiverAccount)
          ? this._sendClaimRequest(donation.id, receiverAccount.id)
          : of(null)
      )
    );
  }

  /**
   * Shows a dialog which prompts the user to select a receiver account for the claim.
   * @return An observable that emits the selected receiver account if one was selected, otherwise null.
   */
  private _showSelectReceiverDialog(): Observable<Account> {
    const selectConfig: AccountSelectConfig = {
      accountType: AccountType.Receiver,
      dialogMessage: 'Select a receiver account that will claim the donation:',
      filterPlaceholder: 'Search Receivers...',
      selectPlaceholder: 'Receiver Account'
    };
    return this._matDialog.open(AccountSelectDialogComponent, { data: selectConfig }).afterClosed();
  }

  /**
   * Sends a donation claim request to the server.
   * @param donationId The ID of the donation that is to be claimed.
   * @param receiverAccountId The ID of the receiver account that shall claim the donation.
   * @return An observable that emits the claimed donation after the server operation completes.
   */
  private _sendClaimRequest(donationId: number, receiverAccountId: number): Observable<Donation> {
    const request: AdminClaimSaveRequest = { donationId, receiverAccountId, sendNotifications: true };
    return this._httpClient.post<Donation>(this.url, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<Donation>({ successMessage: 'Donation successfully claimed' })
    );
  }
}
