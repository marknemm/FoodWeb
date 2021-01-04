import { Component } from '@angular/core';
import { VolunteerComponent } from '~web/account-shared/child-components/volunteer/volunteer.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-admin-volunteer',
  templateUrl: './admin-volunteer.component.html',
  styleUrls: ['./admin-volunteer.component.scss'],
  providers: formProvider(AdminVolunteerComponent)
})
export class AdminVolunteerComponent extends VolunteerComponent {}
