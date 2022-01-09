import { Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { TFormGroup } from '~web/forms';

export class LoginForm extends TFormGroup<LoginFormT> {

  private _mode$ = new BehaviorSubject<LoginFormMode>(LoginFormMode.Login);

  constructor() {
    super({
      usernameEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get isLogin(): boolean {
    return (!this.isUsernameRecovery && !this.isPasswordReset);
  }

  get isPasswordReset(): boolean {
    return this.mode === LoginFormMode.PasswordReset;
  }

  get isUsernameRecovery(): boolean {
    return this.mode === LoginFormMode.UsernameRecovery;
  }

  get mode(): LoginFormMode {
    return this._mode$.value;
  }

  get mode$(): Observable<LoginFormMode> {
    return this._mode$.asObservable();
  }

  get password(): string {
    return this.get('password').value;
  }

  get usernameEmail(): string {
    return this.get('usernameEmail').value;
  }

  get usernameEmailPlaceholder(): string {
    return (this.isUsernameRecovery)
      ? 'Email'
      : 'Username / Email';
  }

  activateLogin(): void {
    this._setLoginFormMode(LoginFormMode.Login);
  }

  activatePasswordReset(): void {
    this._setLoginFormMode(LoginFormMode.PasswordReset);
  }

  activateUsernameRecovery(): void {
    this._setLoginFormMode(LoginFormMode.UsernameRecovery);
  }

  private _setLoginFormMode(mode: LoginFormMode): void {
    this._mode$.next(mode);

    if (!this.isUsernameRecovery) {
      this.reset({ usernameEmail: this.get('usernameEmail').value });
    } else {
      this.reset();
    }

    if (!this.isLogin) {
      this.get('password').disable();
    } else {
      this.get('password').enable();
    }
  }
}

export interface LoginFormT {
  usernameEmail: string;
  password: string;
}

export enum LoginFormMode { Login, UsernameRecovery, PasswordReset }
