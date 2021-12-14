import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { OperationHours, Weekday } from '~shared';
import { TimeRangeArray } from '~web/date-time/forms/time-range.array';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-weekday-operation-hours',
  templateUrl: './weekday-operation-hours.component.html',
  styleUrls: ['./weekday-operation-hours.component.scss'],
  providers: [FormFieldService]
})
export class WeekdayOperationHoursComponent implements OnChanges, OnInit {

  @Input() allowClear = false;
  @Input() allowOverlayClick = false;
  @Input() editable = false;
  @Input() minutesGap = 5;
  @Input() operationHours: OperationHours;
  @Input() timeWidth = '110px';
  @Input() weekday: Weekday;

  constructor(
    private _formFieldService: FormFieldService<TimeRangeArray>
  ) {}

  get timeRangeArray(): TimeRangeArray {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new TimeRangeArray()
    });
  }

  ngOnChanges(): void {
    if (!this.weekday) {
      throw new Error('Weekday input required');
    }
  }

  addTimeRange(): void {
    this.timeRangeArray.push(new TimeRangeForm());
  }
}
