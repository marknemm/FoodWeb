import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, ValidatorFn, FormControl, FormGroupDirective } from '@angular/forms';
import { PasswordMatchService } from '../../../services/password-match/password-match.service';
import { FormHelperService } from '../../../services/form-helper/form-helper.service';
import { Validation } from '../../../../../../shared/src/constants/validation';

export type PasswordFormMode = 'Login' | 'Signup' | 'Account';

@Component({
  selector: 'food-web-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroupName: string;
  @Input() formGroup: FormGroup;
  @Input() formMode: PasswordFormMode = 'Login';

  private _passwordLabel: string;

  constructor(
    public passwordMatchService: PasswordMatchService,
    private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService
  ) {}

  ngOnInit() {
    const passwordValidator: ValidatorFn[] = (this.formMode !== 'Login') ?
      [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX)] :
      [Validators.required];
    const confirmPasswordValidator: ValidatorFn = (this.formMode !== 'Login' ? Validators.required : undefined);
    const oldPasswordValidator: ValidatorFn = (this.formMode === 'Account' ? Validators.required : undefined);

    this.formGroup = this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    this._formHelperService.addMissingControls(
      this.formGroup,
      {
        password: ['', passwordValidator],
        confirmPassword: ['', confirmPasswordValidator],
        oldPassword: ['', oldPasswordValidator]
      }
    );

    if (!this.formGroup.validator) {
      const formValidator: ValidatorFn = (this.formMode !== 'Login' ? this.passwordMatchService.validatePasswordMatch : undefined);
      this.formGroup.setValidators(formValidator);
    }
    if (this.formGroupName && this._formGroupDirective.form) {
      this._formGroupDirective.form.addControl(this.formGroupName, this.formGroup);
    }
    this._passwordLabel = (this.formMode === 'Account' ? 'New Password' : 'Password');
  }

  get passwordLabel(): string {
    return this._passwordLabel;
  }
}
