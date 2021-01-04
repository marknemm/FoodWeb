import { FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { OperationHours, Weekday } from '~shared';
import { TFormGroup } from '~web/forms';

export class OperationHoursForm extends TFormGroup<OperationHours> {

  readonly timeRangeErrStateMatcher: ErrorStateMatcher;

  constructor(operationHours?: Partial<OperationHours>, disableAllOrNothingValidation = false) {
    super({
      id: undefined,
      weekday: undefined,
      startTime: '',
      endTime: ''
    });
    this._initFormValidators(disableAllOrNothingValidation);
    this.timeRangeErrStateMatcher = this._genTimeRangeErrStateMatcher();
    if (operationHours) {
      this.patchValue(operationHours);
    }
  }

  private _initFormValidators(disableAllOrNothingValidation: boolean): void {
    const validators: ValidatorFn[] = [this._timeRangeOrderValidator];
    if (!disableAllOrNothingValidation) {
      validators.push(this._allOrNothingOpHoursValidator);
    }
    this.setValidators(validators);
  }

  private _timeRangeOrderValidator(form: AbstractControl): { timeRangeOrder: string } | null {
    const startTime: string = form.get('startTime').value;
    const endTime: string = form.get('endTime').value;
    return (startTime && endTime && new Date(`1/1/2000 ${startTime}`) >= new Date(`1/1/2000 ${endTime}`))
      ? { timeRangeOrder: 'Start time must be earlier than end time' }
      : null;
  }

  private _allOrNothingOpHoursValidator(form: AbstractControl): { allOrNothing: string } | null {
    const weekday: Weekday = form.get('weekday').value;
    const startTime: string = form.get('startTime').value;
    const endTime: string = form.get('endTime').value;
    return ((startTime && (!endTime || !weekday)) || (endTime && (!startTime || !weekday)))
      ? { allOrNothing: 'Must fill in all fields' }
      : null;
  }

  private _genTimeRangeErrStateMatcher(): ErrorStateMatcher {
    return {
      isErrorState: (control: FormControl, form: FormGroupDirective | NgForm): boolean => {
        if (control === form.control.get('startTime') || control === form.control.get('endTime')) {
          if (form.hasError('timeRangeOrder')) {
            return true;
          }
        }
        return (control && control.invalid && control.touched);
      }
    };
  }
}
