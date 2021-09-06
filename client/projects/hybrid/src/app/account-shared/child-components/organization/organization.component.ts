import { Component } from '@angular/core';
import { OrganizationComponent as WebOrganizationComponent } from '~web/account-shared/child-components/organization/organization.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
  providers: formProvider(OrganizationComponent)
})
export class OrganizationComponent extends WebOrganizationComponent {}
