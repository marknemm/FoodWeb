import { Component, Input, OnInit } from '@angular/core';
import { FormFieldService } from '~web/forms';
import { PasswordForm, PasswordFormAdapter, PasswordFormMode } from '~web/password/services/password-form-adapter/password-form-adapter.service';

@Component({
  selector: 'foodweb-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: [FormFieldService]
})
export class PasswordComponent implements OnInit {

  @Input() editable = false;
  @Input() formMode: PasswordFormMode = 'Signup';

  protected _passwordLabel: string;

  constructor(
    private _formFieldService: FormFieldService<PasswordForm>,
    private _passwordFormAdapter: PasswordFormAdapter,
  ) {}

  get passwordForm(): PasswordForm {
    return this._formFieldService.control;
  }

  get passwordLabel(): string {
    return this._passwordLabel;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._passwordFormAdapter.toForm()
    });

    this._passwordLabel = (this.formMode === 'Signup')
      ? 'New Password'
      : 'Password';
  }
}
