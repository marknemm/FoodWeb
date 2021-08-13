import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccountType } from '~shared';
import { SessionService } from '~web/session/services/session/session.service';
import { SignupComponent as WebSignupComponent } from '~web/signup/components/signup/signup.component';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';
import { SignupService } from '~web/signup/services/signup/signup.service';

@Component({
  selector: 'foodweb-hybrid-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends WebSignupComponent {

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    protected _signupService: SignupService
  ) {
    super(sessionService, signupVerificationService, _signupService, null);
  }

  protected _genAgreementObs(accountType: AccountType): Observable<boolean> {
    return of(true);
  }
}
