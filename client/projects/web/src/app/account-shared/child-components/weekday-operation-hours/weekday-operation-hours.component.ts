import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { OperationHours, Weekday } from '~shared';
import { TimeRangeForm, TimeRangeFormAdapter } from '~web/date-time/services/time-range-form-adapter/time-range-form-adapter.service';
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
    private _formFieldService: FormFieldService<FormArray<TimeRangeForm>>,
    private _timeRangeFormAdapter: TimeRangeFormAdapter,
  ) {}

  get timeRangeArray(): FormArray<TimeRangeForm> {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new FormArray<TimeRangeForm>([])
    });
  }

  ngOnChanges(): void {
    if (!this.weekday) {
      throw new Error('Weekday input required');
    }
  }

  addTimeRange(): void {
    this.timeRangeArray.push(this._timeRangeFormAdapter.toForm());
  }
}
