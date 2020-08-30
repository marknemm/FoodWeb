import { Component, Input, OnInit } from '@angular/core';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { PasswordForm, PasswordFormT } from '~web/password/forms/password.form';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class PasswordBaseComponent extends FormBaseComponent<PasswordFormT> implements OnInit {

  @Input() editing = false;
  @Input() formGroup: PasswordForm;

  protected _passwordLabel: string;

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  get passwordLabel(): string {
    return this._passwordLabel;
  }

  ngOnInit() {
    super.ngOnInit();
    this._passwordLabel = (this.formGroup.formMode === 'Account' ? 'New Password' : 'Password');
  }
}
