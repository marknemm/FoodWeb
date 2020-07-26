import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PasswordForm } from '~web/password/forms/password.form';

@Component({
  selector: 'foodweb-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnChanges {

  @Input() editing = false;
  @Input() formGroup: PasswordForm;

  private _passwordLabel: string;

  constructor() {}

  get passwordLabel(): string {
    return this._passwordLabel;
  }

  ngOnInit() {
    this._passwordLabel = (this.formGroup.formMode === 'Account' ? 'New Password' : 'Password');
  }

  ngOnChanges() {
    this.formGroup = this.formGroup ? this.formGroup : new PasswordForm();
  }
}
