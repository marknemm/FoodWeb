import { Component } from '@angular/core';
import { OrganizationBaseComponent } from '~web/account-shared/child-components/organization/organization.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-organization',
  templateUrl: './app-organization.component.html',
  styleUrls: ['./app-organization.component.scss'],
  providers: valueAccessorProvider(AppOrganizationComponent)
})
export class AppOrganizationComponent extends OrganizationBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
