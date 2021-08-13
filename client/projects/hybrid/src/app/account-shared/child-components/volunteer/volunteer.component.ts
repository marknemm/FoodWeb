import { Component } from '@angular/core';
import { VolunteerComponent as WebVolunteerComponent } from '~web/account-shared/child-components/volunteer/volunteer.component';

@Component({
  selector: 'foodweb-hybrid-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss']
})
export class VolunteerComponent extends WebVolunteerComponent {}
