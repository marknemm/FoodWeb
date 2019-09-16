import { Component, OnInit, Input, ViewChild, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { DateTimeComponent } from '../date-time/date-time.component';
import { DateTimeRangeForm } from '../../forms/date-time-range.form';
import { FormHelperService } from '../../../shared/services/form-helper/form-helper.service';

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
  @Input() initStartDateToday = false;
  @Input() initEndDateToday = false;
  @Input() defaultStartTime = '9:00 am';
  @Input() defaultEndTime = '5:00 pm';
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
