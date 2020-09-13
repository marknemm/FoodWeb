import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { openUrl } from '@nativescript/core/utils';
import { dial } from 'nativescript-phone';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { Focusable } from '~app/app-shared/interfaces/focusable';
import { ContactInfoBaseComponent } from '~web/account-shared/child-components/contact-info/contact-info.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-contact-info',
  templateUrl: './app-contact-info.component.html',
  styleUrls: ['./app-contact-info.component.scss'],
  providers: valueAccessorProvider(AppContactInfoComponent)
})
export class AppContactInfoComponent extends ContactInfoBaseComponent implements Focusable {

  @Input() finalReturnKeyType = 'next';

  @Output() finalReturnPress = new EventEmitter<void>();

  @ViewChild('emailField', { static: true }) firstFocusable: AppTextFieldComponent;

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  /**
   * Opens the user's default mail client to email a user associated with this contact info.
   */
  openEmail(): void {
    openUrl(`mailto:${this.contactInfo.email}`);
  }

  /**
   * Opens a phone interface to make a phone call to the user associated with this contact info.
   */
  openPhoneCall(): void {
    dial(this.contactInfo.phoneNumber, true);
  }

  focus(): void {
    this.firstFocusable.focus();
  }
}
