import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SignupService } from '~hybrid/bootstrap/services/signup/signup.service';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { SessionService } from '~web/session/services/session/session.service';
import { SignupComponent as WebSignupComponent } from '~web/signup/components/signup/signup.component';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-hybrid-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends WebSignupComponent {

  readonly formGroup = new AccountForm({ formMode: 'Signup' });

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    protected _signupService: SignupService
  ) {
    super(sessionService, signupVerificationService, _signupService, null);
  }

  protected _genAgreementObs(): Observable<boolean> {
    return of(true); // TODO
  }
}
