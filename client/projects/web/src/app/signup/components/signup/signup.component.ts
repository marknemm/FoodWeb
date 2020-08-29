import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AccountType } from '~shared';
import { SessionService } from '~web/session/services/session/session.service';
import { TermsConditionsDialogComponent } from '~web/signup/components/terms-conditions-dialog/terms-conditions-dialog.component';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';
import { SignupService } from '~web/signup/services/signup/signup.service';
import { SignupBaseComponent } from './signup.base.component';

@Component({
  selector: 'foodweb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends SignupBaseComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    protected _signupService: SignupService,
    private _matDialog: MatDialog,
  ) {
    super(sessionService, signupVerificationService, _signupService);
  }

  ngOnInit() {}

  protected _genAgreementObs(accountType: AccountType): Observable<boolean> {
    return TermsConditionsDialogComponent.open(this._matDialog, { accountType });
  }

}
