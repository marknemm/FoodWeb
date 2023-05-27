import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Validation } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class PasswordFormAdapter extends FormAdapter<string, PasswordFormData> {

  readonly passwordErrStateMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective | NgForm): boolean => {
      if (control === form.control.get('confirmPassword') && form.hasError('passwordConfirmMatch')) {
        return control.touched;
      }
      return (control && control.invalid && control.touched);
    }
  };

  toForm(config?: PasswordFormConfig): PasswordForm {
    const form = this._formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(Validation.PASSWORD_REGEX)]],
      confirmPassword: ['', Validators.required],
      oldPassword: ['', config?.formMode !== 'Signup' ? Validators.required : []]
    }, config);

    this._initForm(form, config);
    form.addValidators(this._validatePasswordMatch);

    return this._initForm(form, config);
  }

  toModel(viewModel?: PasswordForm | PasswordFormData): string {
    return this._getViewModelData(viewModel).password;
  }

  toViewModel(model?: string): PasswordFormData {
    return {
      confirmPassword: model,
      password: model,
      oldPassword: model
    };
  }

  private _validatePasswordMatch(form: AbstractControl): { passwordConfirmMatch: string } {
    const password: string = form.get('password').value;
    const confirmPassword: string = form.get('confirmPassword').value;
    return (!password || !confirmPassword || password === confirmPassword) ?
      null :
      { passwordConfirmMatch: 'Confirmation password does not match password' };
  }
}

export type PasswordForm = FormGroup<Controls<PasswordFormData>>;
export interface PasswordFormData {
  password: string;
  confirmPassword: string;
  oldPassword: string;
}

export type PasswordFormMode = 'Signup' | 'Account';
export interface PasswordFormConfig extends FormConfig<string> {
  formMode?: PasswordFormMode;
}
