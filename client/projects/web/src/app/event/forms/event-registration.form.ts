import { Validators } from '@angular/forms';
import { Account, AccountHelper, EventRegistration, Validation } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { SessionService } from '~web/session/session/session.service';

export class EventRegistrationForm extends TypedFormGroup<EventRegistration> {

  constructor(sessionService: SessionService) {
    super({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]]
    });
    this._attemptInitValuesFromSession(sessionService)
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
