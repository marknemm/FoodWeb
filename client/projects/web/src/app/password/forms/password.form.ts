import { AbstractControl, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Validation } from '~shared';
import { TFormGroup } from '~web/forms';

export class PasswordForm extends TFormGroup<PasswordFormT> {

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

  get passwordErrorMsg(): string {
    return this.get('password').hasError('pattern')
      ? 'At least 6 characters required'
      : '';
  }

  private _validatePasswordMatch(form: AbstractControl): { passwordConfirmMatch: string } {
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
    };
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
