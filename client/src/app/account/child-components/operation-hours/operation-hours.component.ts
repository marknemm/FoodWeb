import { Component, OnInit, Input, forwardRef, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject, of, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TypedFormArray } from '../../../data-structure/typed-form-array';
import { OperationHoursForm } from '../../forms/operation-hours.form';
import { ConstantsService } from '../../../shared/services/constants/constants.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog/confirm-dialog.service';
import { DateTimeService } from '../../../date-time/services/date-time/date-time.service';
import { WeekdayFillerService } from '../../../date-time/services/weekday-fillter/weekday-filler.service';
import { OperationHours } from '../../../../../../shared/src/interfaces/account/operation-hours';

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
  formArray: TypedFormArray<OperationHours>;

  private _destroy$ = new Subject();

  constructor(
    public constantsService: ConstantsService,
    public dateTimeService: DateTimeService,
    private _confirmDialogService: ConfirmDialogService,
    private _weekdayFillerService: WeekdayFillerService
  ) {}

  ngOnInit() {
    this.formArray = new TypedFormArray<OperationHours>([], new OperationHoursForm(this.dateTimeService));
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
    this.formArray.push({ weekday: <any>'', startTime: '', endTime: '' });
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

  registerOnTouched(): void {}
}
