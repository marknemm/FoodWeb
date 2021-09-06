import { Component } from '@angular/core';
import { ContactInfoComponent as WebContactInfoComponent } from '~web/account-shared/child-components/contact-info/contact-info.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: formProvider(ContactInfoComponent)
})
export class ContactInfoComponent extends WebContactInfoComponent {}
