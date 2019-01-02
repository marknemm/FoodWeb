import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/account/account.service';
import { PasswordMatchService } from './../../services/password-match/password-match.service';
import { Validation } from './../../../../../shared/src/constants/validation';

@Component({
  selector: 'food-web-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(
    public passwordMatchService: PasswordMatchService,
    private _formBuilder: FormBuilder,
    private _accountService: AccountService
  ) {}

  ngOnInit() {
    this.signupForm = this._formBuilder.group(
      {
        accountType: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX)]],
        confirmPassword: ['', Validators.required],
        organization: [null, Validators.required],
        contactInfo: [null, Validators.required],
        operationHours: [[]]
      },
      { validators: this.passwordMatchService.validatePasswordMatch }
    );
  }

  signup(): void {
    if (this.signupForm.valid) {
      this._accountService.createAccount(this.signupForm.getRawValue(), this.signupForm.get('password').value);
    }
  }

}
