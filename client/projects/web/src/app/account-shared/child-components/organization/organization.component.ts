import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import { OrganizationBaseComponent } from './organization.base.component';

@Component({
  selector: 'foodweb-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
  providers: formProvider(OrganizationComponent)
})
export class OrganizationComponent extends OrganizationBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
