import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { Focusable } from '~app/app-shared/interfaces/focusable';
import { PasswordBaseComponent } from '~web/account-shared/child-components/password/password.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-password',
  templateUrl: './app-password.component.html',
  styleUrls: ['./app-password.component.scss'],
  providers: valueAccessorProvider(AppPasswordComponent)
})
export class AppPasswordComponent extends PasswordBaseComponent implements Focusable {

  @ViewChild('oldPasswordField', { static: true }) oldPasswordField: AppTextFieldComponent;
  @ViewChild('passwordField', { static: true }) passwordField: AppTextFieldComponent;

  @Output() finalReturnPress = new EventEmitter<boolean>();

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  get firstFocusable(): AppTextFieldComponent {
    return (this.formGroup.formMode === 'Account')
      ? this.oldPasswordField
      : this.passwordField;
  }

  focus(): void {
    this.firstFocusable.focus();
  }
}
