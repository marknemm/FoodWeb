import { Injectable } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PasswordMatchService implements ErrorStateMatcher {

  constructor() {}

  validatePasswordMatch(form: FormGroup): { passwordConfirmMatch: string } {
    const password: string = form.get('password').value;
    const confirmPassword: string = form.get('confirmPassword').value;
    return (!password || !confirmPassword || password === confirmPassword) ?
      null :
      { passwordConfirmMatch: 'Confirmation password do not match password' };
  }

  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    if (control === form.control.get('confirmPassword') && form.hasError('passwordConfirmMatch')) {
      return control.touched;
    }
    return (control && control.invalid && control.touched);
  }
}
