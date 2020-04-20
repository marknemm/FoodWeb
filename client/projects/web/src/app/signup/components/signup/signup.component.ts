import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Account, AccountType } from '~shared';
import { AccountForm } from '~web/account/account.form';
import { SessionService } from '~web/session/session/session.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';
import { SignupVerificationService } from '~web/signup/signup-verification/signup-verification.service';
import { SignupService } from '~web/signup/signup/signup.service';
import { TermsConditionsDialogComponent } from '~web/signup/terms-conditions-dialog/terms-conditions-dialog.component';

@Component({
  selector: 'food-web-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    private _matDialog: MatDialog,
    private _pageTitleService: PageTitleService,
    private _signupService: SignupService
  ) {}

  ngOnInit() {
    this._pageTitleService.title = 'Signup';
  }

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
