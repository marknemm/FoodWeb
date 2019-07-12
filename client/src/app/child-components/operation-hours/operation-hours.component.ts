import { Component, OnInit, Input, forwardRef, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, ValidationErrors, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject, of, Observable, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlexFormArray } from '../../etc/flex-form-array';
import { ConstantsService } from '../../services/constants/constants.service';
import { ConfirmDialogService } from '../../services/confirm-dialog/confirm-dialog.service';
import { DateTimeService } from '../../services/date-time/date-time.service';
import { WeekdayFillerService } from '../../services/weekday-fillter/weekday-filler.service';
import { OperationHours } from '../../../../../shared/src/interfaces/account/operation-hours';

@Component({
  selector: 'food-web-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OperationHoursComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => OperationHoursComponent), multi: true }
  ]
})
export class OperationHoursComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {

  @Input() editing = false;
  @Input() operationHoursArr: OperationHours[] = [];
  @Input() fillMissingWeekdays = false;

  timeFieldErrStateMatcher: ErrorStateMatcher;
  formArray: FlexFormArray;

  private _destroy$ = new Subject();

  constructor(
    public constantsService: ConstantsService,
    public dateTimeService: DateTimeService,
    private _formBuilder: FormBuilder,
    private _confirmDialogService: ConfirmDialogService,
    private _weekdayFillerService: WeekdayFillerService
  ) {}

  ngOnInit() {
    this.formArray = new FlexFormArray([],
      this._formBuilder.group(
        {
          id: undefined,
          weekday: '',
          startTime: '',
          endTime: ''
        },
        { 
          validators: [
            this.dateTimeService.genTimeRangeOrderValidator('startTime', 'endTime'),
            this._allOrNothingTimeValidator.bind(this)
          ]
        }
      )
    );
    this.timeFieldErrStateMatcher = this.dateTimeService.genTimeRangeErrStateMatcher('startTime', 'endTime');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.operationHoursArr) {
      // Ensure this executes after ngOnInit lifecycle hook and not in middle of change detection cycle.
      setTimeout(() => this.writeValue(this.operationHoursArr));
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  addOperationHours(): void {
    this.formArray.push({ weekday: '', startTime: '', endTime: '' });
  }

  removeOperationHours(idx: number): void {
    this._getDeleteConfirmation(idx).subscribe(
      (confirm: boolean) => {
        if (confirm) {
          this.formArray.removeAt(idx);
        }
      }
    );
  }

  private _getDeleteConfirmation(idx: number): Observable<boolean> {
    const confirmMsg = 'Are you sure you wish to delete the operation hours?';
    let deleteConfirmation$: Observable<boolean> = of(true);
    if (this.formArray.at(idx).value.startTime && this.formArray.at(idx).value.endTime) {
      deleteConfirmation$ = this._confirmDialogService.displayConfirmDialog(confirmMsg, 'Confirm Delete');
    }
    return deleteConfirmation$;
  }

  writeValue(operationHoursArr: OperationHours[]): void {
    this.operationHoursArr = operationHoursArr;
    operationHoursArr = (operationHoursArr == null) ? [] : operationHoursArr;
    if (this.fillMissingWeekdays) {
      operationHoursArr = this._weekdayFillerService.fillMissingWeekdays(operationHoursArr);
    }
    this.formArray.setValue(operationHoursArr, { emitEvent: false });
  }

  registerOnChange(callbackFn: (operationHoursArr: OperationHours[]) => void): void {
    this.formArray.deepValueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => {
      let value: OperationHours[] = this.formArray.value;
      // Be sure to remove empty weekdays before passing change value up.
      value = value.filter((operationHours: OperationHours) => !!operationHours.startTime);
      callbackFn(value);
    });
  }

  validate(): ValidationErrors {
    return (this.formArray.invalid ? { invalid: true } : null);
  }

  private _allOrNothingTimeValidator(form: FormGroup): { allOrNothing: string } {
    const weekday = form.get('weekday').value;
    const startTime = form.get('startTime').value;
    const endTime = form.get('endTime').value;
    if ((startTime && (!endTime || !weekday)) || (endTime && (!startTime || !weekday))) {
      return { allOrNothing: 'Must fill in all fields' };
    }
    return null;
  }

  registerOnTouched(_: any): void {}
}
