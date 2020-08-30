import { Component } from '@angular/core';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { VolunteerBaseComponent } from './volunteer.base.component';

@Component({
  selector: 'foodweb-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.scss'],
  providers: valueAccessorProvider(VolunteerComponent)
})
export class VolunteerComponent extends VolunteerBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
