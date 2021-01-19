import { Injectable } from '@angular/core';
import { Account, AccountType, DonationHub } from '~shared';
import { DonationHubPrivileges } from '~web/donation-hub/interfaces/donation-hub-privileges';
import { SessionService } from '~web/session/services/session/session.service';
export { DonationHubPrivileges };

@Injectable({
  providedIn: 'root'
})
export class DonationHubPrivilegesService {

  constructor(
    private _sessionService: SessionService
  ) {}

  determinePrivileges(donationHub: DonationHub, account: Account = this._sessionService.account): DonationHubPrivileges {
    const hasOwnership: boolean = (donationHub.volunteerAccount?.id === account?.id);
    return {
      delete: hasOwnership,
      donate: (!hasOwnership && [AccountType.Volunteer, AccountType.Donor].indexOf(account?.accountType) >= 0),
      edit: hasOwnership
    };
  }
}
