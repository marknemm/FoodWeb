import { Component, Input, OnInit } from '@angular/core';
import { FormBaseComponent, FormHelperService } from '~web/forms';
import { PasswordForm } from '~web/password/forms/password.form';

@Component({ template: '' })
export class PasswordBaseComponent extends FormBaseComponent<PasswordForm> implements OnInit {

  @Input() editable = false;

  protected _passwordLabel: string;

  constructor(formHelperService: FormHelperService) {
    super(() => new PasswordForm(), formHelperService);
  }

  get passwordLabel(): string {
    return this._passwordLabel;
  }

  ngOnInit() {
    this._passwordLabel = (this.formGroup.formMode === 'Account' ? 'New Password' : 'Password');
  }
}
