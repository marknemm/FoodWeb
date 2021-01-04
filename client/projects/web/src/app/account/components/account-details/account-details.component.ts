import { Component } from '@angular/core';
import { formProvider } from '~web/forms';
import { AccountDetailsBaseComponent } from './account-details.base.component';

@Component({
  selector: 'foodweb-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  providers: formProvider(AccountDetailsComponent)
})
export class AccountDetailsComponent extends AccountDetailsBaseComponent {
  readonly contactInfoFields = ['contactInfo.email', 'contactInfo.phoneNumber', 'contactInfo.streetAddress',
                                'contactInfo.city', 'contactInfo.stateProvince', 'contactInfo.postalCode'];
  readonly notificationFields = ['contactInfo.enableEmail', 'contactInfo.enablePushNotification', 'contactInfo.notifyForEachDonation'];
}
