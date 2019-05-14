import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { SessionService } from '../../services/session/session.service';
import { AccountService, Account } from '../../services/account/account.service';
import { FlexFormArray } from '../../etc/flex-form-array';

@Component({
  selector: 'food-web-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  accountForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    public sessionService: SessionService,
    private _formBuilder: FormBuilder,
    private _accountService: AccountService
  ) {}

  ngOnInit() {
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
  }

  signup(): void {
    if (this.signupForm.valid) {
      const account: Account = this.accountForm.value;
      const password: string = this.passwordForm.get('password').value;
      this._accountService.createAccount(account, password);
    }
  }

}
