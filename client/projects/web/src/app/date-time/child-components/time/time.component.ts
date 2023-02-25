import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-time',
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
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() minutesGap = 5;
  @Input() placeholder = '';
  @Input() preventOverlayClick = false;
  @Input() get value(): string     { return this._formFieldService.value; }
           set value(time: string) { this._formFieldService.valueIn(time); }

  @Output() valueChanges: EventEmitter<string> = this._formFieldService.valueChangesEmitter;

  constructor(
    private _dateTimeService: DateTimeService,
    private _formFieldService: FormFieldService<string>
  ) {}

  /**
   * If the current value of this time control is empty, then uses the `defaultTime` input binding.
   * Otherwise, uses the current value.
   */
  get activeDefaultTime(): string | Date {
    return (this.value ? this.value : this.defaultTime);
  }

  get formControl(): FormControl<string> {
    return this._formFieldService.control;
  }

  /**
   * Whether or not to show the clear button for the time input field.
   */
  get showClearButton(): boolean {
    return (this.allowClear && this.formControl?.value && this.formControl.enabled);
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      valueInConverter: (time: string) => this._dateTimeService.roundTimeNearestMinutes(time, this.minutesGap)
    });
  }

  /**
   * Clears the time input field.
   * @param event The mouse (button) click event.
   */
  clearTime(event: MouseEvent): void {
    this.formControl.reset();
    event.stopPropagation();
  }
}
