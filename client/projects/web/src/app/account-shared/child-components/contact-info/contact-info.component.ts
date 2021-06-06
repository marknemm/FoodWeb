import { Component } from '@angular/core';
import { formProvider } from '~web/forms';
import { ContactInfoBaseComponent } from './contact-info.base.component';

@Component({
  selector: 'foodweb-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: formProvider(ContactInfoComponent)
})
export class ContactInfoComponent extends ContactInfoBaseComponent {}
