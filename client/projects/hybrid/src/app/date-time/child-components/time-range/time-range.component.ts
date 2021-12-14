import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { TimeRange } from '~shared';
import { TimeRangeForm } from '~web/date-time/forms/time-range.form';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-time-range',
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
  @Input() endLabel = 'End Time';
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'floating';
  @Input() minuteValues = '0,5,10,15,20,25,30,35,40,45,50,55';
  @Input() startLabel = 'Start Time';
  @Input() timeWidth = '';
  @Input() get value(): TimeRange      { return this._formFieldService.value; }
           set value(range: TimeRange) { this._formFieldService.valueIn(range); }

  @HostBinding() class = 'foodweb-time-range';

  constructor(
    private _formFieldService: FormFieldService<TimeRangeForm>
  ) {}

  get timeRangeForm(): TimeRangeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({ genDefault: () => new TimeRangeForm() });
  }
}
