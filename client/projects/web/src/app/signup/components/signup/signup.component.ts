import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { AccountType } from '~shared';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { SessionService } from '~web/session/services/session/session.service';
import { TermsConditionsDialogComponent } from '~web/signup/components/terms-conditions-dialog/terms-conditions-dialog.component';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';
import { SignupService } from '~web/signup/services/signup/signup.service';

@Component({
  selector: 'foodweb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    protected _signupService: SignupService,
    private _matDialog: MatDialog,
  ) {}

  signup(accountForm: AccountForm): void {
    accountForm.markAllAsTouched();
    if (accountForm.valid) {
      const accountType: AccountType = accountForm.get('accountType').value;
      const agreement$: Observable<boolean> = (accountType === AccountType.Receiver)
        ? of(true)
        : this._genAgreementObs(accountType);
      agreement$.subscribe((agreed: boolean) => {
        this._signupService.createAccount(accountForm, agreed).subscribe();
      });
    }
  }

  protected _genAgreementObs(accountType: AccountType): Observable<boolean> {
    return TermsConditionsDialogComponent.open(this._matDialog, { accountType });
  }

}
