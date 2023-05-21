import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { TimeRange } from '~shared';
import { TimeRangeForm, TimeRangeFormAdapter } from '~web/date-time/services/time-range-form-adapter/time-range-form-adapter.service';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss'],
  providers: [FormFieldService]
})
export class TimeRangeComponent implements OnInit {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() defaultEndTime: string | Date = '12:00 pm';
  @Input() defaultStartTime: string | Date = '12:00 pm';
  @Input() editable = false;
  @Input() endPlaceholder = 'End Time';
  @Input() startPlaceholder = 'Start Time';
  @Input() floatLabels = true;
  @Input() minutesGap = 5;
  @Input() preventOverlayClick = false;
  @Input() timeWidth = '';
  @Input() get value(): TimeRange      { return this._formFieldService.valueOut(); }
           set value(range: TimeRange) { this._formFieldService.valueIn(range); }

  @Output() valueChanges: EventEmitter<TimeRange> = this._formFieldService.valueChangesEmitter;

  @HostBinding() class = 'foodweb-time-range';

  constructor(
    private _formFieldService: FormFieldService<TimeRange, TimeRangeForm>,
    private _timeRangeFormAdapter: TimeRangeFormAdapter,
  ) {}

  get rangeErrStateMatcher(): ErrorStateMatcher {
    return this._timeRangeFormAdapter.rangeErrStateMatcher;
  }

  get timeRangeForm(): TimeRangeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._timeRangeFormAdapter.toForm()
    });
  }
}
