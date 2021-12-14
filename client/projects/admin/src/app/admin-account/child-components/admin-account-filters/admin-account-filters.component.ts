import { Component, Input } from '@angular/core';
import { AccountFiltersComponent } from '~web/account/child-components/account-filters/account-filters.component';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { FormFieldService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-admin-account-filters',
  templateUrl: './admin-account-filters.component.html',
  styleUrls: ['./admin-account-filters.component.scss'],
  providers: [FormFieldService]
})
export class AdminAccountFiltersComponent extends AccountFiltersComponent {

  @Input() omitSorting = false;

  constructor(
    public constantsService: ConstantsService,
    formFieldService: FormFieldService<AccountFiltersForm>
  ) {
    super(formFieldService);
  }

}
