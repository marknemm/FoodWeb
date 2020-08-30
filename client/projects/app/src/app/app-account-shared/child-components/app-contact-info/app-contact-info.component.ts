import { Component } from '@angular/core';
import { openUrl } from '@nativescript/core/utils';
import { ContactInfoBaseComponent } from '~web/account-shared/child-components/contact-info/contact-info.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { dial } from 'nativescript-phone';

@Component({
  selector: 'foodweb-app-contact-info',
  templateUrl: './app-contact-info.component.html',
  styleUrls: ['./app-contact-info.component.scss'],
  providers: valueAccessorProvider(AppContactInfoComponent)
})
export class AppContactInfoComponent extends ContactInfoBaseComponent {

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
}
