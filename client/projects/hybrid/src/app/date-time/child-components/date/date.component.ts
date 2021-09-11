import { Component, Input, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { FormFieldService, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: [FormFieldService]
})
export class DateComponent implements OnInit {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() calendarMode = false;
  @Input() dateFilter: DateFilterFn<Date>;
  @Input() defaultDate: Date;
  @Input() editable = false;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() label: string;
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'fixed';
  @Input() maxDate: Date;
  @Input() minDate = new Date();
  @Input() minWidth = '';
  @Input() get value(): Date     { return this._formFieldService.value; }
           set value(date: Date) { this._formFieldService.valueIn(date); }

  constructor(
    private _formFieldService: FormFieldService<Date>
  ) {}

  get formControl(): TFormControl<Date> {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl();
  }

}
