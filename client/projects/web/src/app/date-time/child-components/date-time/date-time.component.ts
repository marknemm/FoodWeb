import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';
import { DateTimeForm, DateTimeFormAdapter, DateTimeFormData } from '~web/date-time/services/date-time-form-adapter/date-time-form-adapter.service';
import { FormFieldProviders, FormFieldService  } from '~web/forms';

@Component({
  selector: 'foodweb-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [FormFieldProviders]
})
export class DateTimeComponent implements OnInit {

  @Input() allowClear = false;
  @Input() allowUndefTime = false;
  @Input() boldDate = false;
  @Input() boldTime = false;
  @Input() datePlaceholder = 'Date';
  @Input() defaultDate: Date;
  @Input() defaultTime = '12:00 pm';
  @Input() editable = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() excludeDateDisplay = false;
  @Input() excludeTimeDisplay = false;
  @Input() floatLabels: FloatLabelType = 'auto';
  @Input() inlineFields = true;
  @Input() maxDate: Date;
  @Input() minDate: Date = new Date();
  @Input() minDateWidth = '';
  @Input() minutesGap = 5;
  @Input() primaryLabel = '';
  @Input() timePlaceholder = 'Time';
  @Input() get value(): Date     { return this._formFieldService.valueOut(); }
           set value(date: Date) { this._formFieldService.valueIn(date); }

  @Output() valueChanges = new EventEmitter<Date>();

  constructor(
    private _dateTimeFormAdapter: DateTimeFormAdapter,
    private _formFieldService: FormFieldService<DateTimeFormData, DateTimeForm, Date>,
  ) {
    this._formFieldService.registerControl(this._dateTimeFormAdapter.toForm(), {
      valueInConverter: (date: Date) => this._dateTimeFormAdapter.toViewModel(date),
      valueOutConverter: (data: DateTimeFormData) => this._dateTimeFormAdapter.toModel(data)
    });
    this._formFieldService.valueChanges$.subscribe((value: DateTimeFormData) =>
      this.valueChanges.emit(this._dateTimeFormAdapter.toModel(value))
    );
  }

  /**
   * Acts an an internal form group. The formControl exposed to the outside will gather this form's data
   * together as a single Date value.
   */
  get dateTimeForm(): DateTimeForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    if (!this.dateTimeForm.value.date || !this.dateTimeForm.value.time) {
      this.dateTimeForm.patchValue(this._dateTimeFormAdapter.toViewModel(this.defaultDate));
    }
  }
}
