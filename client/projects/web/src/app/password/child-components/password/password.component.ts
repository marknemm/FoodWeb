import { Component, Input, OnInit } from '@angular/core';
import { PasswordForm } from '~web/password/password.form';

@Component({
  selector: 'food-web-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

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
}
