import { Component } from '@angular/core';
import { VolunteerComponent } from '~web/account-shared/child-components/volunteer/volunteer.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-admin-volunteer',
  templateUrl: './admin-volunteer.component.html',
  styleUrls: ['./admin-volunteer.component.scss'],
  providers: [FormFieldService]
})
export class AdminVolunteerComponent extends VolunteerComponent {}
