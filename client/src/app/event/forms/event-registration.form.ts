import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { SessionService } from '../../session/services/session/session.service';
import { Validation } from '../../../../../shared/src/constants/validation';
import { Account } from '../../../../../shared/src/interfaces/account/account';
import { AccountHelper } from '../../../../../shared/src/helpers/account-helper';
import { EventRegistration } from '../../../../../shared/src/interfaces/event/event-registration';

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
      const accountHelper: AccountHelper = new AccountHelper();
      const account: Account = sessionService.account;
      this.get('fullName').setValue(accountHelper.accountName(account));
      this.get('email').setValue(account.contactInfo.email);
      this.get('phoneNumber').setValue(account.contactInfo.phoneNumber);
    }
  }
}
