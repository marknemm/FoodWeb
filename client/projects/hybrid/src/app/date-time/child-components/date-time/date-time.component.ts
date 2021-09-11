import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormFieldService, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [FormFieldService]
})
export class DateTimeComponent implements OnChanges, OnInit {

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
  @Input() minuteValues = '0,5,10,15,20,25,30,35,40,45,50,55';

  readonly dateTimeFormControl = new TFormControl<string>();

  private _displayFormat = 'MMM D YYYY, h:mm A';

  constructor(
    private _formFieldService: FormFieldService<string, Date>
  ) {}

  @Input()
  get value(): Date {
    return (this.dateTimeFormControl.value ? new Date(this.dateTimeFormControl.value) : null);
  }

  set value(date: Date) {
    this.dateTimeFormControl.setValue(date ? date.toISOString() : '', { emitEvent: false });
  }

  get displayFormat(): string {
    return this._displayFormat;
  }

  ngOnInit() {
    this._formFieldService.registerControl(this.dateTimeFormControl, {
      valueInConverter: (date: Date) => (date ? date.toISOString() : ''),
      valueOutConverter: (dateStr: string) => (dateStr ? new Date(dateStr) : null)
    });
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
