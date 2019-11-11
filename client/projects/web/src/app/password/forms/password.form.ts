import { Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TypedFormGroup } from '~web/data-structure';
import { Validation } from '~shared';

export class PasswordForm extends TypedFormGroup<PasswordFormT> {

  readonly passwordMatchErrStateMatcher: ErrorStateMatcher;
  readonly formMode: PasswordFormMode;

  constructor(config: PasswordFormConfig = {}) {
    super({
      password: ['', [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX)]],
      confirmPassword: ['', Validators.required],
      oldPassword: ''
    });
    this.setValidators(this._validatePasswordMatch);
    this.passwordMatchErrStateMatcher = this._genPasswordMatchErrStateMatcher();
    this.formMode = (config.formMode ? config.formMode : 'Account');
    if (this.formMode === 'Account') {
      this.get('oldPassword').setValidators(Validators.required);
    }
    if (config.value) {
      this.patchValue(config.value);
    }
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

export type PasswordFormMode = 'Signup' | 'Account';

export interface PasswordFormConfig {
  value?: Partial<PasswordFormT>;
  formMode?: PasswordFormMode;
}

export interface PasswordFormT {
  password: string;
  confirmPassword: string;
  oldPassword: string;
}
