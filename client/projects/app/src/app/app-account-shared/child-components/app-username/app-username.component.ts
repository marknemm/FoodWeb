import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { UsernameBaseComponent } from '~web/account-shared/child-components/username/username.base.component';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-username',
  templateUrl: './app-username.component.html',
  styleUrls: ['./app-username.component.scss'],
  providers: formProvider(AppUsernameComponent)
})
export class AppUsernameComponent extends UsernameBaseComponent implements FocusableComponent {

  @Input() nextFocus: Focusable;

  @Output() finalReturnPress = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();

  @ViewChild('usernameField', { static: true }) firstFocusable: AppTextFieldComponent;

  constructor(
    private _focusService: AppFocusService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  get focusable(): boolean {
    return this.editable;
  }

  focus(): boolean {
    return this._focusService.focus(this, this.firstFocusable);
  }
}
