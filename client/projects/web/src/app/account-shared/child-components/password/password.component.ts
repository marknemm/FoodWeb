import { Component, Input, OnInit } from '@angular/core';
import { FormFieldService } from '~web/forms';
import { PasswordForm } from '~web/password/forms/password.form';

@Component({
  selector: 'foodweb-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: [FormFieldService]
})
export class PasswordComponent implements OnInit {

  @Input() editable = false;

  protected _passwordLabel: string;

  constructor(
    private _formFieldService: FormFieldService<PasswordForm>
  ) {}

  get passwordForm(): PasswordForm {
    return this._formFieldService.control;
  }

  get passwordLabel(): string {
    return this._passwordLabel;
  }

  ngOnInit() {
    this._formFieldService.injectControl({
      genDefault: () => new PasswordForm()
    });

    this._passwordLabel = (this.passwordForm.formMode === 'Account')
      ? 'New Password'
      : 'Password';
  }
}
