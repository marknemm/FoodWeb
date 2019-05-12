import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SessionService } from '../../services/session/session.service';
import { AccountService, Account } from '../../services/account/account.service';
import { FlexFormArray } from '../../etc/flex-form-array';
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
    private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._initForm();
    this._listenAccountTypeRoute();
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  signup(): void {
    if (this.signupForm.valid) {
      const account: Account = this.accountForm.value;
      const password: string = this.passwordForm.get('password').value;
      this._accountService.createAccount(account, password);
    }
  }

  private _initForm(): void {
    this.accountForm = this._formBuilder.group({
      accountType: ['', Validators.required],
      username: ['', Validators.required],
      organization: new FormGroup({}),
      contactInfo: new FormGroup({}),
      operationHours: new FlexFormArray([])
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

}
