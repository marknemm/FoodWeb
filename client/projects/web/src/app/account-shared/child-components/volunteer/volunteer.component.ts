import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
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
