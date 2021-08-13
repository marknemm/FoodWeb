import { Component } from '@angular/core';
import { OperationHoursComponent as WebOperationHoursComponent } from '~web/account-shared/child-components/operation-hours/operation-hours.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
  providers: formProvider(OperationHoursComponent)
})
export class OperationHoursComponent extends WebOperationHoursComponent {}
