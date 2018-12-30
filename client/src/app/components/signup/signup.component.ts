import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignupService } from '../../services/signup/signup.service';
import { SignupValidationService } from './../../services/signup-validation/signup-validation.service';
import { Validation } from './../../../../../shared/src/constants/validation';
import { AccountType, AccountTypes } from './../../../../../shared/src/interfaces/account';

@Component({
  selector: 'food-web-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  readonly accountTypes: AccountType[] = AccountTypes;
  signupForm: FormGroup;

  constructor(
    public signupValidationService: SignupValidationService,
    private _formBuilder: FormBuilder,
    private _signupService: SignupService
  ) {}

  ngOnInit() {
    this.signupForm = this._formBuilder.group(
      {
        accountType: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX)]],
        confirmPassword: ['', [Validators.required]],
        organizationName: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]],
        streetAddress: ['', [Validators.required]],
        city: ['', [Validators.required]],
        stateProvince: ['', [Validators.required]],
        postalCode: ['', [Validators.required, Validators.pattern(Validation.POSTAL_CODE_REGEX)]],
        operationHours: [],
        organizationInfo: ''
      },
      { validators: this.signupValidationService.passwordConfirmMatch }
    );
  }

  signup(): void {
    if (this.signupForm.valid) {
      this._signupService.signup(this.signupForm.getRawValue());
    }
  }

}
