import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccountType } from '~shared';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { SessionService } from '~web/session/services/session/session.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';
import { SignupService } from '~web/signup/services/signup/signup.service';

@Component({ template: '' })
export abstract class SignupBaseComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    protected _signupService: SignupService
  ) {}

  ngOnInit() {}

  signup(accountForm: AccountForm): void {
    if (accountForm.checkValidity()) {
      const accountType: AccountType = accountForm.get('accountType').value;
      const agreement$: Observable<boolean> = (accountType === AccountType.Receiver)
        ? of(true)
        : this._genAgreementObs(accountType);
      agreement$.subscribe((agreed: boolean) => {
        this._signupService.createAccount(accountForm, agreed);
      });
    }
  }

  protected abstract _genAgreementObs(accountType: AccountType): Observable<boolean>;

}
