import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginRequest } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class LoginFormAdapter extends FormAdapter<LoginRequest, LoginFormData> {

  toForm(config?: LoginFormConfig): LoginForm {
    const form: LoginForm = this._initForm(config);
    this.toMode(form, config?.mode ?? LoginFormMode.Login);
    return form;
  }

  toModel(viewModel?: LoginForm | Partial<LoginFormData>): LoginRequest {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<LoginRequest>): LoginFormData {
    return {
      usernameEmail: model?.usernameEmail,
      password: model?.password
    };
  }

  toMode(form: LoginForm, mode: LoginFormMode): void {
    if (!form || !mode) { return; } // Do nothing if missing/bad input.

    (mode !== LoginFormMode.UsernameRecovery)
      ? form.reset({ usernameEmail: form.value.usernameEmail })
      : form.reset();

    (mode !== LoginFormMode.Login)
      ? form.controls.password.disable()
      : form.controls.password.enable();
  }

}

export type LoginForm = FormGroup<Controls<LoginFormData>>;
export interface LoginFormData {
  usernameEmail: string;
  password: string;
}

export enum LoginFormMode {
  Login = 'Login',
  PasswordReset = 'PasswordReset',
  UsernameRecovery = 'UsernameRecovery',
}

export interface LoginFormConfig extends FormConfig<LoginRequest> {
  mode?: LoginFormMode;
}
