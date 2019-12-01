import { DonationClaim } from '../interfaces/donation-claim/donation-claim';
import { AccountHelper } from './account-helper';
export { DonationClaim };

export class DonationClaimHelper {

  private _accountHelper = new AccountHelper();

  /**
   * Validates a given donation claim by inspecting the values of its contained properties.
   * @param claim The donation claim that is to be validated.
   * @return The error string if the claim is invalid, an empty string if valid.
   */
  validateDonationClaim(claim: DonationClaim): string {
    if (!claim) { return ''; }

    if (claim.distanceMiToReceiver == null) {
      return 'Distance (miles) to receiver required for donation claim';
    }

    if (claim.durationMinToReceiver == null) {
      return 'Driving duration (minutes) to receiver required for donation claim';
    }

    const receiverAccountErr: string = this._accountHelper.validateAccount(claim.receiverAccount, true);
    if (receiverAccountErr) { return receiverAccountErr; }

    return '';
  }

}
