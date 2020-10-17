import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { ContactInfoBaseComponent } from './contact-info.base.component';

@Component({
  selector: 'foodweb-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: formProvider(ContactInfoComponent)
})
export class ContactInfoComponent extends ContactInfoBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
