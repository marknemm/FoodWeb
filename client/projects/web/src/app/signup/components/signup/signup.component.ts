import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class SignupComponent implements OnInit, OnDestroy {

  formGroup: AccountForm;

  private _operationHoursHeight: number;
  private _destroy$ = new Subject();

  constructor(
    public sessionService: SessionService,
    public signupVerificationService: SignupVerificationService,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _pageTitleService: PageTitleService,
    private _router: Router,
    private _signupService: SignupService
  ) {}

  get accountType(): AccountType {
    return this.formGroup.get('accountType').value;
  }

  get operationHoursFullWidth(): boolean {
    return this.formGroup.get('operationHours').value.limitOperationHours;
  }

  get operationHoursHeight(): number {
    return this._operationHoursHeight;
  }

  get loading(): boolean {
    return this._signupService.loading;
  }

  ngOnInit() {
    this._pageTitleService.title = 'Signup';
    this.formGroup = new AccountForm({ formMode: 'Signup' }, this._destroy$.asObservable());
    this._listenAccountTypeSelect();
    this._listenAccountTypeRoute();
  }

  private _listenAccountTypeSelect(): void {
    // When accountType form field is updated, we must update route so user can rely on back button / link directly to correct signup.
    this.formGroup.get('accountType').valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe((accountType: AccountType) => {
      this._router.navigate(['/signup', accountType]);
      this._pageTitleService.title = 'Signup';
    });
  }

  private _listenAccountTypeRoute(): void {
    this._activatedRoute.paramMap.subscribe((routeParams: ParamMap) => {
      const accountTypeParam = <AccountType>routeParams.get('accountType');
      if (accountTypeParam) {
        this.formGroup.get('accountType').setValue(accountTypeParam);
      }
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  signup(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const agreement$: Observable<boolean> = this._genAgreementObs();
      agreement$.subscribe((agreed: boolean) => {
        const account: Account = this.formGroup.toAccount();
        const password: string = this.formGroup.getPasswordValue();
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
