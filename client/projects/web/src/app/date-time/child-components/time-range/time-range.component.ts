import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { TimeRange } from '~shared';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
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
  @Input() get value(): TimeRange      { return this._formFieldService.value; }
           set value(range: TimeRange) { this._formFieldService.valueIn(range); }

  @Output() valueChanges: EventEmitter<TimeRange> = this._formFieldService.valueChangesEmitter;

  @HostBinding() class = 'foodweb-time-range';

  constructor(
    private _formFieldService: FormFieldService<TimeRangeForm>
  ) {}

  get timeRangeForm(): TimeRangeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new TimeRangeForm()
    });

  }
}
