import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { openUrl } from '@nativescript/core/utils';
import { dial } from 'nativescript-phone';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { ContactInfoBaseComponent } from '~web/account-shared/child-components/contact-info/contact-info.base.component';
import { formProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-contact-info',
  templateUrl: './app-contact-info.component.html',
  styleUrls: ['./app-contact-info.component.scss'],
  providers: formProvider(AppContactInfoComponent)
})
export class AppContactInfoComponent extends ContactInfoBaseComponent implements FocusableComponent {

  @Input() finalReturnKeyType = 'next';
  @Input() nextFocus: Focusable;

  @Output() finalReturnPress = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();

  @ViewChild('emailField', { static: true }) firstFocusable: AppTextFieldComponent;

  constructor(
    private _focusService: AppFocusService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  /**
   * Opens the user's default mail client to email a user associated with this contact info.
   */
  openEmail(): void {
    openUrl(`mailto:${this.value.email}`);
  }

  /**
   * Opens a phone interface to make a phone call to the user associated with this contact info.
   */
  openPhoneCall(): void {
    dial(this.value.phoneNumber, true);
  }

  focus(): boolean {
    return this._focusService.focus(this, this.firstFocusable);
  }
}
