import { Component } from '@angular/core';
import { OrganizationComponent as WebOrganizationComponent } from '~web/account-shared/child-components/organization/organization.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
  providers: [FormFieldService]
})
export class OrganizationComponent extends WebOrganizationComponent {}
