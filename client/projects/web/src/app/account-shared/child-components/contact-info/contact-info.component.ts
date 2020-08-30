import { Component } from '@angular/core';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { ContactInfoBaseComponent } from './contact-info.base.component';

@Component({
  selector: 'foodweb-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: valueAccessorProvider(ContactInfoComponent)
})
export class ContactInfoComponent extends ContactInfoBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
