import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account, AccountType } from '~shared';

import { SessionService } from '~web/session/services/session/session.service';
import { AccountForm } from '~web/account/forms/account.form';
import { TermsConditionsDialogComponent } from '~web/signup/components/terms-conditions-dialog/terms-conditions-dialog.component';
import { SignupService } from '~web/signup/services/signup/signup.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'food-web-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  accountForm: AccountForm;

  private _operationHoursHeight: number;
  private _destroy$ = new Subject();

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    private _signupService: SignupService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
  ) {}

  get accountType(): AccountType {
    return this.accountForm.get('accountType').value;
  }

  get operationHoursFullWidth(): boolean {
    return this.accountForm.get('operationHours').value.limitOperationHours;
  }

  get operationHoursHeight(): number {
    return this._operationHoursHeight;
  }

  get loading(): boolean {
    return this._signupService.loading;
  }

  ngOnInit() {
    this.accountForm = new AccountForm({ formMode: 'Signup' }, this._destroy$.asObservable());
    this._listenAccountTypeSelect();
    this._listenAccountTypeRoute();
  }

  private _listenAccountTypeSelect(): void {
    // When accountType form field is updated, we must update route so user can rely on back button / link directly to correct signup.
    this.accountForm.get('accountType').valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe((accountType: AccountType) =>
      this._router.navigate(['/signup', accountType])
    );
  }

  private _listenAccountTypeRoute(): void {
    this._activatedRoute.paramMap.subscribe((routeParams: ParamMap) => {
      const accountTypeParam = <AccountType>routeParams.get('accountType');
      if (accountTypeParam) {
        this.accountForm.get('accountType').setValue(accountTypeParam);
      }
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  signup(): void {
    this.accountForm.markAllAsTouched();
    if (this.accountForm.valid) {
      const agreement$: Observable<boolean> = this._genAgreementObs();
      agreement$.subscribe((agreed: boolean) => {
        const account: Account = this.accountForm.toAccount();
        const password: string = this.accountForm.getPasswordValue();
        this._signupService.createAccount(account, password, agreed);
      });
    }
  }

  private _genAgreementObs(): Observable<boolean> {
    if (this.accountType === 'Receiver') {
      return of(true);
    }
    return TermsConditionsDialogComponent.open(this._matDialog, { accountType: this.accountType });
  }

}
