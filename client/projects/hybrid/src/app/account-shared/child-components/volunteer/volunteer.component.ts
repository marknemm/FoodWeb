import { Component } from '@angular/core';
import { VolunteerComponent as WebVolunteerComponent } from '~web/account-shared/child-components/volunteer/volunteer.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss'],
  providers: [FormFieldService]
})
export class VolunteerComponent extends WebVolunteerComponent {}
