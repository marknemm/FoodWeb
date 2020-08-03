import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Account, AccountType } from '~shared';
import { AccountForm } from '~web/account/forms/account.form';
import { SessionService } from '~web/session/services/session/session.service';
import { TermsConditionsDialogComponent } from '~web/signup/components/terms-conditions-dialog/terms-conditions-dialog.component';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';
import { SignupService } from '~web/signup/services/signup/signup.service';

@Component({
  selector: 'foodweb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    private _matDialog: MatDialog,
    private _signupService: SignupService
  ) {}

  ngOnInit() {}

  signup(accountForm: AccountForm): void {
    accountForm.markAllAsTouched();
    if (accountForm.valid) {
      const accountType: AccountType = accountForm.get('accountType').value;
      this._genAgreementObs(accountType).subscribe((agreed: boolean) => {
        const account: Account = accountForm.toAccount();
        const password: string = accountForm.password;
        this._signupService.createAccount(account, password, agreed);
      });
    }
  }

  private _genAgreementObs(accountType: AccountType): Observable<boolean> {
    return (accountType === 'Receiver')
      ? of(true)
      : TermsConditionsDialogComponent.open(this._matDialog, { accountType });
  }

}
