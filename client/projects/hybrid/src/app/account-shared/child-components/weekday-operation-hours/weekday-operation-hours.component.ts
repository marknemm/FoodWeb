import { Component } from '@angular/core';
import { WeekdayOperationHoursComponent as WebWeekdayOperationHoursComponent } from '~web/account-shared/child-components/weekday-operation-hours/weekday-operation-hours.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-weekday-operation-hours',
  templateUrl: './weekday-operation-hours.component.html',
  styleUrls: ['./weekday-operation-hours.component.scss'],
  providers: formProvider(WeekdayOperationHoursComponent)
})
export class WeekdayOperationHoursComponent extends WebWeekdayOperationHoursComponent {}
