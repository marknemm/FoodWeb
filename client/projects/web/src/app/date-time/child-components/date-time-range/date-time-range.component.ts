import { Component, OnInit, Input, ViewChild, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FormHelperService } from '~web/shared';

import { DateTimeComponent } from '~web/date-time/child-components/date-time/date-time.component';
import { DateTimeRangeForm } from '~web/date-time/forms/date-time-range.form';

@Component({
  selector: 'food-web-date-time-range',
  templateUrl: './date-time-range.component.html',
  styleUrls: ['./date-time-range.component.scss']
})
export class DateTimeRangeComponent implements OnInit {

  @Input() formGroupName: string;
  @Input() formGroup: DateTimeRangeForm;
  @Input() startDatePlaceholder = 'Start Date';
  @Input() startTimePlaceholder = 'Start Time';
  @Input() endDatePlaceholder = 'End Date';
  @Input() endTimePlaceholder = 'End Time';
  @Input() minDate = new Date();
  @Input() maxDate: Date;
  @Input() floatLabels = true;

  @ViewChild('startDateTime', { static: false }) startDateTime: DateTimeComponent;
  @ViewChild('endDateTime', { static: false }) endDateTime: DateTimeComponent;  

  constructor(
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.formGroup = <DateTimeRangeForm>this._formHelper.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
  }

  markAsTouched(): void {
    this.formGroup.markAsTouched();
    this.startDateTime.markAsTouched();
    this.endDateTime.markAsTouched();
  }

  markAsPristine(): void {
    this.formGroup.markAsPristine();
    this.startDateTime.markAsPristine();
    this.endDateTime.markAsPristine();
  }
}
