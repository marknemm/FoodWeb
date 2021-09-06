import { Component } from '@angular/core';
import { VolunteerForm } from '~web/account-shared/forms/volunteer.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss'],
  providers: formProvider(VolunteerComponent)
})
export class VolunteerComponent extends FormBaseComponent<VolunteerForm> {
  constructor(formHelperService: FormHelperService) {
    super(() => new VolunteerForm(), formHelperService);
  }
}
