import { Component, Input, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormFieldService, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: [FormFieldService]
})
export class TimeComponent implements OnInit {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() defaultTime: string | Date =  '12:00 pm';
  @Input() editable = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() label: string;
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'fixed';
  @Input() minutesGap = 5;

  readonly dateFormControl = new TFormControl<Date>();

  constructor(
    private _dateTimeService: DateTimeService,
    private _formFieldService: FormFieldService<Date, string>,
  ) {}

  /**
   * If the current value of this time control is empty, then uses the `defaultTime` input binding.
   * Otherwise, uses the current value.
   */
  get activeDefaultTime(): string | Date {
    return (this.value ? this.value : this.defaultTime);
  }

  /**
   * Whether or not to show the clear button for the time input field.
   */
  get showClearButton(): boolean {
    return (this.allowClear && this.dateFormControl?.value && this.dateFormControl.enabled);
  }

  @Input()
  get value(): string {
    return this._dateTimeService.toTimeStr(this.dateFormControl.value);
  }

  set value(value: string) {
    this.dateFormControl.setValue(this._dateTimeService.timeStrToDate(value), { emitEvent: false });
  }

  ngOnInit(): void {
    this._formFieldService.registerControl(this.dateFormControl, {
      valueInConverter: (timeStr: string) => this._dateTimeService.timeStrToDate(timeStr),
      valueOutConverter: (date: Date) => this._dateTimeService.toTimeStr(date)
    });
  }

  /**
   * Clears the time input field.
   * @param event The mouse (button) click event.
   */
  clearTime(event: MouseEvent): void {
    this.dateFormControl.reset();
    event.stopPropagation();
  }

}
