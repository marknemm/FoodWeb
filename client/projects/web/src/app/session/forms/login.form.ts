import { Validators } from '@angular/forms';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export interface LoginFormT {
  usernameEmail: string;
  password: string;
}

export class LoginForm extends TypedFormGroup<LoginFormT> {

  constructor() {
    super({
      usernameEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
