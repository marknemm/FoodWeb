import { Validators } from '@angular/forms';
import { TFormGroup } from '~web/data-structure/t-form-group';

export interface LoginFormT {
  usernameEmail: string;
  password: string;
}

export class LoginForm extends TFormGroup<LoginFormT> {

  constructor() {
    super({
      usernameEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
