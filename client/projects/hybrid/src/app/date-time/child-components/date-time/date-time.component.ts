import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormFieldService } from '~web/forms';

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
  @Input() get value(): Date     { return this._toDate(this.dateTimeFormControl.value) }
           set value(date: Date) { this.dateTimeFormControl.patchValue(this._toString(date), { emitEvent: false }) }

  private _displayFormat = 'MMM D YYYY, h:mm A';

  constructor(
    private _dateTimeService: DateTimeService,
    private _formFieldService: FormFieldService<string>
  ) {
    this._formFieldService.registerControl(new FormControl<string>(''));
  }

  get dateTimeFormControl(): FormControl<string> {
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
      this.dateTimeFormControl.patchValue(this._toString(defaultDateTime));
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

  private _toDate(dateStr: string): Date {
    return (dateStr ? new Date(dateStr) : null);
  }

  private _toString(date: Date): string {
    return (date ? date.toISOString() : '');
  }

}
