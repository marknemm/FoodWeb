import { FormControl, FormGroupDirective, NgForm, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { OperationHours, Weekday } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class OperationHoursForm extends TypedFormGroup<OperationHours> {

  readonly timeRangeErrStateMatcher: ErrorStateMatcher;

  constructor(operationHours?: Partial<OperationHours>, disableAllOrNothingValidation = false) {
    super({
      id: undefined,
      weekday: null,
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

  private _timeRangeOrderValidator(form: OperationHoursForm): { timeRangeOrder: string } {
    const startTime: string = form.get('startTime').value;
    const endTime: string = form.get('endTime').value;
    return (!startTime || !endTime || new Date(`1/1/2000 ${startTime}`) < new Date(`1/1/2000 ${endTime}`))
      ? null
      : { timeRangeOrder: 'Start time must be earlier than end time' };
  }

  private _allOrNothingOpHoursValidator(form: OperationHoursForm): { allOrNothing: string } {
    const weekday: Weekday = form.get('weekday').value;
    const startTime: string = form.get('startTime').value;
    const endTime: string = form.get('endTime').value;
    if ((startTime && (!endTime || !weekday)) || (endTime && (!startTime || !weekday))) {
      return { allOrNothing: 'Must fill in all fields' };
    }
    return null;
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
    }
  }
}
