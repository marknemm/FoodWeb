import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FormHelperService } from '~web/form-helper/form-helper.service';

import { PasswordForm } from '~web/password.form';

@Component({
  selector: 'food-web-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  @Input() editing = false;
  @Input() formGroupName: string;
  @Input() formGroup: PasswordForm;

  private _passwordLabel: string;

  constructor(
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService
  ) {}

  get passwordLabel(): string {
    return this._passwordLabel;
  }

  ngOnInit() {
    this.formGroup = <PasswordForm>this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    this._passwordLabel = (this.formGroup.formMode === 'Account' ? 'New Password' : 'Password');
  }
}
