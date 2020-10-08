import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { PasswordBaseComponent } from '~web/account-shared/child-components/password/password.base.component';
import { formProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-password',
  templateUrl: './app-password.component.html',
  styleUrls: ['./app-password.component.scss'],
  providers: formProvider(AppPasswordComponent)
})
export class AppPasswordComponent extends PasswordBaseComponent implements FocusableComponent {

  @Input() nextFocus: Focusable;

  @Output() finalReturnPress = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();

  @ViewChild('oldPasswordField', { static: true }) oldPasswordField: AppTextFieldComponent;
  @ViewChild('passwordField', { static: true }) passwordField: AppTextFieldComponent;

  constructor(
    private _focusService: AppFocusService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  get firstFocusable(): AppTextFieldComponent {
    return (this.formGroup.formMode === 'Account')
      ? this.oldPasswordField
      : this.passwordField;
  }

  focus(): boolean {
    return this._focusService.focus(this, this.firstFocusable);
  }
}
