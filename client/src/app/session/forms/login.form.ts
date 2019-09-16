import { Validators } from '@angular/forms';
import { TypedFormGroup } from '../../data-structure/typed-form-group';

export interface LoginFormT {
  username: string;
  password: string;
}

export class LoginForm extends TypedFormGroup<LoginFormT> {

  constructor() {
    super({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
