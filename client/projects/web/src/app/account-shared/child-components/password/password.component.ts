import { Component, Input, OnInit } from '@angular/core';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { PasswordForm } from '~web/password/forms/password.form';

@Component({
  selector: 'foodweb-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: formProvider(PasswordComponent)
})
export class PasswordComponent extends FormBaseComponent<PasswordForm> implements OnInit {

  @Input() editable = false;

  protected _passwordLabel: string;

  constructor(formHelperService: FormHelperService) {
    super(() => new PasswordForm(), formHelperService);
  }

  get passwordLabel(): string {
    return this._passwordLabel;
  }

  ngOnInit() {
    this._passwordLabel = (this.formGroup.formMode === 'Account')
      ? 'New Password'
      : 'Password';
  }
}
