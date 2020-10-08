import { Component, Input, OnInit } from '@angular/core';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { PasswordForm } from '~web/password/forms/password.form';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class PasswordBaseComponent extends FormBaseComponent<PasswordForm> implements OnInit {

  @Input() editable = false;

  protected _passwordLabel: string;

  constructor(formHelperService: FormHelperService) {
    super(new PasswordForm(), formHelperService);
  }

  get passwordLabel(): string {
    return this._passwordLabel;
  }

  ngOnInit() {
    this._passwordLabel = (this.formGroup.formMode === 'Account' ? 'New Password' : 'Password');
  }
}
