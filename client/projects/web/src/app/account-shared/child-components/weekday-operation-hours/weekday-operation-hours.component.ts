import { Component } from '@angular/core';
import { formProvider } from '~web/forms';
import { WeekdayOperationHoursBaseComponent } from './weekday-operation-hours.base.component';

@Component({
  selector: 'foodweb-weekday-operation-hours',
  templateUrl: './weekday-operation-hours.component.html',
  styleUrls: ['./weekday-operation-hours.component.scss'],
  providers: formProvider(WeekdayOperationHoursComponent)
})
export class WeekdayOperationHoursComponent extends WeekdayOperationHoursBaseComponent {}
