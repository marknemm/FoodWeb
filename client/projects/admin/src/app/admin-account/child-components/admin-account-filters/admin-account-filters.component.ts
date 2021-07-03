import { Component, Input } from '@angular/core';
import { AccountFiltersComponent } from '~web/account/child-components/account-filters/account-filters.component';
import { FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-admin-account-filters',
  templateUrl: './admin-account-filters.component.html',
  styleUrls: ['./admin-account-filters.component.scss'],
  providers: formProvider(AdminAccountFiltersComponent)
})
export class AdminAccountFiltersComponent extends AccountFiltersComponent {

  @Input() omitSorting = false;

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

}
