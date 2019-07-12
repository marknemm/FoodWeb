import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TermsConditionsDialogComponent } from '../terms-conditions-dialog/terms-conditions-dialog.component';
import { AlertService } from '../../services/alert/alert.service';
import { SessionService } from '../../services/session/session.service';
import { AccountService, Account } from '../../services/account/account.service';
import { AccountType } from '../../../../../shared/src/interfaces/account/account';

@Component({
  selector: 'food-web-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  signupForm: FormGroup;
  accountForm: FormGroup;
  passwordForm: FormGroup;

  private _destroy$ = new Subject();

  constructor(
    public sessionService: SessionService,
    public accountService: AccountService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _alertService: AlertService
  ) {}

  get accountType(): AccountType {
    return this.accountForm.get('accountType').value;
  }

  ngOnInit() {
    this._initForm();
    this._listenAccountTypeRoute();
  }

  private _initForm(): void {
    this.accountForm = this._formBuilder.group({
      accountType: ['', Validators.required],
      username: ['', Validators.required],
      organization: new FormGroup({}),
      volunteer: new FormGroup({}),
      contactInfo: new FormGroup({}),
      operationHours: new FormControl([])
    });
    this.passwordForm = new FormGroup({});
    this.signupForm = this._formBuilder.group({
      account: this.accountForm,
      password: this.passwordForm
    });

    // When accountType form field is updated, we must update route so user can rely on back button / link directly to correct signup.
    this.accountForm.get('accountType').valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe((accountType: AccountType) =>
      this._router.navigate(['/signup', accountType])
    );
  }

  private _listenAccountTypeRoute(): void {
    this._activatedRoute.paramMap.pipe(
      takeUntil(this._destroy$)
    ).subscribe((routeParams: ParamMap) => {
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
    this.signupForm.markAllAsTouched();
    if (this.signupForm.valid) {
      const agreement$: Observable<boolean> = this._genAgreementObs();
      agreement$.subscribe((agreed: boolean) => {
        if (agreed) {
          const account: Account = this.accountForm.value;
          const password: string = this.passwordForm.get('password').value;
          this.accountService.createAccount(account, password);
        } else {
          this._alertService.displaySimpleMessage('You must accept the terms and conditions to complete signup', 'danger');
        }
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
