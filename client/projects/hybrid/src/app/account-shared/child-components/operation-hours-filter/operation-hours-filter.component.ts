import { Component } from '@angular/core';
import { OperationHoursFilterComponent as WebOperationHoursFilterComponent } from '~web/account-shared/child-components/operation-hours-filter/operation-hours-filter.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-operation-hours-filter',
  templateUrl: './operation-hours-filter.component.html',
  styleUrls: ['./operation-hours-filter.component.scss'],
  providers: [FormFieldService]
})
export class OperationHoursFilterComponent extends WebOperationHoursFilterComponent {}
