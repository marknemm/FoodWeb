import { Validators } from '@angular/forms';
import { Account, AccountHelper, EventRegistration, Validation } from '~shared';
import { TFormGroup } from '~web/data-structure/t-form-group';
import { SessionService } from '~web/session/services/session/session.service';

export class EventRegistrationForm extends TFormGroup<EventRegistration> {

  constructor(sessionService: SessionService) {
    super({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]],
      timezone: ['', Validators.required]
    });
    this._initTimezone();
    this._attemptInitValuesFromSession(sessionService);
  }

  private _initTimezone(): void {
    const timezone: string = (Intl.DateTimeFormat().resolvedOptions().timeZone)
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'America/New_York';
    this.get('timezone').setValue(timezone);
  }

  private _attemptInitValuesFromSession(sessionService: SessionService): void {
    if (sessionService.loggedIn && sessionService.isVolunteer) {
      const accountHelper = new AccountHelper();
      const account: Account = sessionService.account;
      this.get('fullName').setValue(accountHelper.accountName(account));
      this.get('email').setValue(account.contactInfo.email);
      this.get('phoneNumber').setValue(account.contactInfo.phoneNumber);
    }
  }
}
