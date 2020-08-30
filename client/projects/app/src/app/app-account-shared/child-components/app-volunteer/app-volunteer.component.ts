import { Component } from '@angular/core';
import { VolunteerBaseComponent } from '~web/account-shared/child-components/volunteer/volunteer.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-volunteer',
  templateUrl: './app-volunteer.component.html',
  styleUrls: ['./app-volunteer.component.scss'],
  providers: valueAccessorProvider(AppVolunteerComponent)
})
export class AppVolunteerComponent extends VolunteerBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
