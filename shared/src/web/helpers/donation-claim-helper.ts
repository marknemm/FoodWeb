import { DonationClaim, MapRoute } from '../interfaces/donation-claim/donation-claim';
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

    if (!claim.routeToReceiver) {
      return 'Route to receiver rquired for donation claim';
    }

    const routeToReceiverErr: string = this.validateRouteToReceiver(claim.routeToReceiver);
    if (routeToReceiverErr) { return routeToReceiverErr; }

    const receiverAccountErr: string = this._accountHelper.validateAccount(claim.receiverAccount);
    if (receiverAccountErr) { return receiverAccountErr; }

    return '';
  }

  /**
   * Validates a given route to receiver by inspected the values of its contained properties.
   * @param routeToReceiver The route to receiver that is to be validated.
   * @return The error strin gif the route to receiver is invalid, an empty string if valid.
   */
  validateRouteToReceiver(routeToReceiver: MapRoute): string {
    if (!routeToReceiver) { return ''; }

    if (routeToReceiver.distanceMi == null) {
      return `Distance (miles) to receiver required for donation claim's route to receiver`;
    }

    if (routeToReceiver.durationMin == null) {
      return `Driving duration (minutes) to receiver required for donation claim's route to receiver`;
    }

    if (routeToReceiver.directions == null) {
      return `Driving directions to receiver required for donation claim's route to receiver`;
    }

    return '';
  }

}
