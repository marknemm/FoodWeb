import { Component } from '@angular/core';
import { WeekdayOperationHoursBaseComponent } from '~web/account-shared/child-components/weekday-operation-hours/weekday-operation-hours.base.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-weekday-operation-hours',
  templateUrl: './app-weekday-operation-hours.component.html',
  styleUrls: ['./app-weekday-operation-hours.component.scss'],
  providers: formProvider(AppWeekdayOperationHoursComponent)
})
export class AppWeekdayOperationHoursComponent extends WeekdayOperationHoursBaseComponent {}
