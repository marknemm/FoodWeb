import { Component } from '@angular/core';
import { IonMask, PHONE_NUMBER_MASK } from '~hybrid/shared/directives/ion-mask/ion-mask.directive';
import { ContactInfoComponent as WebContactInfoComponent } from '~web/account-shared/child-components/contact-info/contact-info.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: [FormFieldService]
})
export class ContactInfoComponent extends WebContactInfoComponent {

  readonly PHONE_NUMBER_MASK: IonMask = PHONE_NUMBER_MASK;

}
