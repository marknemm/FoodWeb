import { Validators, ValidatorFn, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { Validation } from '../../../../../shared/src/constants/validation';

export interface PasswordFormT {
  password: string;
  confirmPassword: string;
  oldPassword: string;
}

export type PasswordFormMode = 'Signup' | 'Account';

export class PasswordForm extends TypedFormGroup<PasswordFormT> {

  readonly formMode: PasswordFormMode;
  readonly passwordMatchErrStateMatcher: ErrorStateMatcher;

  constructor(formMode: PasswordFormMode, passwordFormVal: Partial<PasswordFormT> = {}) {
    super({
      password: ['', [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX)]],
      confirmPassword: ['', Validators.required],
      oldPassword: ['', (formMode === 'Account' ? Validators.required : undefined)]
    });
    this.patchValue(passwordFormVal);
    this.setValidators(this._validatePasswordMatch);
    this.formMode = formMode;
    this.passwordMatchErrStateMatcher = this._genPasswordMatchErrStateMatcher();
  }

  private _validatePasswordMatch(form: PasswordForm): { passwordConfirmMatch: string } {
    const password: string = form.get('password').value;
    const confirmPassword: string = form.get('confirmPassword').value;
    return (!password || !confirmPassword || password === confirmPassword) ?
      null :
      { passwordConfirmMatch: 'Confirmation password do not match password' };
  }

  private _genPasswordMatchErrStateMatcher(): ErrorStateMatcher {
    return {
      isErrorState: (control: FormControl, form: FormGroupDirective | NgForm): boolean => {
        if (control === form.control.get('confirmPassword') && form.hasError('passwordConfirmMatch')) {
          return control.touched;
        }
        return (control && control.invalid && control.touched);
      }
    }
  }
}
