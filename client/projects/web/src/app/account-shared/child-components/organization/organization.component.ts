import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
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
