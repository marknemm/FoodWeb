import { Component } from '@angular/core';
import { OperationHoursInfoBaseComponent } from '~web/account-shared/child-components/operation-hours-info/operation-hours-info.base.component';
import { formProvider } from '~web/data-structure/form-base-component';

@Component({
  selector: 'foodweb-app-operation-hours-info',
  templateUrl: './app-operation-hours-info.component.html',
  styleUrls: ['./app-operation-hours-info.component.scss'],
  providers: formProvider(AppOperationHoursInfoComponent)
})
export class AppOperationHoursInfoComponent extends OperationHoursInfoBaseComponent {}
