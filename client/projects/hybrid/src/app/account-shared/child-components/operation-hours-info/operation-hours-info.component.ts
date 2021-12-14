import { Component } from '@angular/core';
import { OperationHoursInfoComponent as WebOperationHoursInfoComponent } from '~web/account-shared/child-components/operation-hours-info/operation-hours-info.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-operation-hours-info',
  templateUrl: './operation-hours-info.component.html',
  styleUrls: ['./operation-hours-info.component.scss'],
  providers: [FormFieldService]
})
export class OperationHoursInfoComponent extends WebOperationHoursInfoComponent {}
