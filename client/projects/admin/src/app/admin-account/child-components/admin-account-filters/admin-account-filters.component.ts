import { Component, Input } from '@angular/core';
import { AccountFiltersComponent } from '~web/account/child-components/account-filters/account-filters.component';
import { Convert } from '~web/component-decorators';
import { FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-admin-account-filters',
  templateUrl: './admin-account-filters.component.html',
  styleUrls: ['./admin-account-filters.component.scss'],
  providers: formProvider(AdminAccountFiltersComponent)
})
export class AdminAccountFiltersComponent extends AccountFiltersComponent {

  @Convert()
  @Input() omitSorting: boolean = false;

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

}
