import { Component, OnInit, Input, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateTimeRange, DateTimeService } from '../../services/date-time/date-time.service';

@Component({
  selector: 'food-web-date-time-select',
  templateUrl: './date-time-select.component.html',
  styleUrls: ['./date-time-select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimeSelectComponent), multi: true },
  ]
})
export class DateTimeSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() rangeWindow: DateTimeRange;
  @Input() rangeWindowStart: Date;
  @Input() rangeWindowEnd: Date;
  @Input() rangeMins: number;
  @Input() ariaLabel: string;

  dateTimeRanges: DateTimeRange[] = [];
  dateTimeControl = new FormControl();

  private _destroy$ = new Subject();

  constructor(
    private _dateTimeService: DateTimeService
  ) {}

  ngOnInit() {
    if (!this.rangeWindow && this.rangeWindowStart && this.rangeWindowEnd) {
      this.rangeWindow = { startDateTime: this.rangeWindowStart, endDateTime: this.rangeWindowEnd };
    }
    this.dateTimeRanges = this._dateTimeService.genDateTimeRangeIncrements(this.rangeWindow, this.rangeMins);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  writeValue(value: DateTimeRange): void {
    this.dateTimeControl.setValue(value);
  }

  registerOnChange(changeCb: (value: DateTimeRange) => void): void {
    this.dateTimeControl.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(changeCb);
  }

  registerOnTouched(_: any): void {}
}
