import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import { VolunteerBaseComponent } from './volunteer.base.component';

@Component({
  selector: 'foodweb-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss'],
  providers: formProvider(VolunteerComponent)
})
export class VolunteerComponent extends VolunteerBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
