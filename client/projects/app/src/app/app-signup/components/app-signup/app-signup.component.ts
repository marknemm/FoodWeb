import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppSessionService } from '~app/app-session/services/app-session/app-session.service';
import { AccountType } from '~shared';
import { SignupBaseComponent } from '~web/signup/components/signup/signup.base.component';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';
import { SignupService } from '~web/signup/services/signup/signup.service';

@Component({
  selector: 'foodweb-app-signup',
  templateUrl: './app-signup.component.html',
  styleUrls: ['./app-signup.component.scss']
})
export class AppSignupComponent extends SignupBaseComponent implements OnInit {

  constructor(
    public sessionService: AppSessionService,
    public signupVerificationService: SignupVerificationService,
    protected _signupService: SignupService
  ) {
    super(sessionService, signupVerificationService, _signupService);
  }

  ngOnInit() {}

  protected _genAgreementObs(accountType: AccountType): Observable<boolean> {
    return of(true);
  }

}
