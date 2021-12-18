import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormFieldService, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [FormFieldService]
})
export class DateTimeComponent implements OnChanges {

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
  @Input() boldDate = false;
  @Input() boldTime = false;
  @Input() defaultDate: Date;
  @Input() defaultTime = '12:00 pm';
  @Input() editable = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() excludeDate = false;
  @Input() excludeDateDisplay = false;
  @Input() excludeTime = false;
  @Input() excludeTimeDisplay = false;
  @Input() label: string;
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'fixed';
  @Input() maxDate: Date;
  @Input() minDate = new Date();
  @Input() minDateWidth = '';
  @Input() minutesGap = 5;
  @Input() get value(): Date     { return this._formFieldService.valueOut(); }
           set value(date: Date) { this._formFieldService.valueIn(date); }

  private _displayFormat = 'MMM D YYYY, h:mm A';

  constructor(
    private _dateTimeService: DateTimeService,
    private _formFieldService: FormFieldService<string, Date>
  ) {
    this._formFieldService.registerControl(new TFormControl<string>(), {
      valueInConverter: (date: Date) => (date ? date.toISOString() : ''),
      valueOutConverter: (dateStr: string) => (dateStr ? new Date(dateStr) : null)
    });
  }

  get dateTimeFormControl(): TFormControl<string> {
    return this._formFieldService.control;
  }

  get displayFormat(): string {
    return this._displayFormat;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.excludeDate || changes.excludeTime) {
      this._refreshPickerFormat();
    }

    if (!this.maxDate) {
      this.maxDate = new Date(new Date().getTime() + 1893417100000); // +100 years
    }

    if (!this.minDate) {
      this.minDate = new Date(new Date().getTime() - 1893417100000); // -100 years
    }

    if (changes.defaultDate || changes.defaultTime && !this.value) {
      const defaultDateTime: Date = this._dateTimeService.combineDateTime(this.defaultDate ?? new Date(), this.defaultTime);
      this._formFieldService.valueIn(defaultDateTime, { emitEvent: true });
    }
  }

  /**
   * Refreshes the underlying ion-datetime field's picker format based on input bindings.
   */
  private _refreshPickerFormat(): void {
    this._displayFormat = '';
    if (!this.excludeDate) {
      this._displayFormat += 'MMM D YYYY';
    }
    if (!this.excludeDate && !this.excludeTime) {
      this._displayFormat += ', ';
    }
    if (!this.excludeTime) {
      this._displayFormat += 'h:mm A';
    }
  }

}
