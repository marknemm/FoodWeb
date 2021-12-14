import { Component } from '@angular/core';
import { WeekdayOperationHoursComponent as WebWeekdayOperationHoursComponent } from '~web/account-shared/child-components/weekday-operation-hours/weekday-operation-hours.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-weekday-operation-hours',
  templateUrl: './weekday-operation-hours.component.html',
  styleUrls: ['./weekday-operation-hours.component.scss'],
  providers: [FormFieldService]
})
export class WeekdayOperationHoursComponent extends WebWeekdayOperationHoursComponent {}
