import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionService } from '../../services/session/session.service';
import { AccountService } from '../../services/account/account.service';
import { PasswordMatchService } from '../../services/password-match/password-match.service';
import { Validation } from '../../../../../shared/src/constants/validation';
import { Account } from '../../../../../shared/src/interfaces/account';

@Component({
  selector: 'food-web-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;


  constructor(
    public sessionService: SessionService,
    public passwordMatchService: PasswordMatchService,
    private _accountService: AccountService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const account: Account = this.sessionService.account;
    this.accountForm = this._formBuilder.group(
      {
        accountType: ['', Validators.required],
        username: ['', Validators.required],
        oldPassword: ['', Validators.required],
        password: ['', [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX)]],
        confirmPassword: ['', Validators.required],
        organization: ['', Validators.required],
        contactInfo: ['', Validators.required],
        operationHours: [[]]
      },
      { validators: this.passwordMatchService.validatePasswordMatch }
    );
    this.accountForm.patchValue(account);
  }

  updateAccount(): void {
    if (this.accountForm.valid) {
      this._accountService.updateAccount(this.accountForm.value, this.accountForm.get('password').value, this.accountForm.get('oldPassword').value);
    }
  }

}
