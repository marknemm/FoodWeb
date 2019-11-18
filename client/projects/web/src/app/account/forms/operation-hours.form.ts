import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TypedFormGroup } from '~web/typed-form-group';
import { OperationHours, Weekday } from '~shared';

export class OperationHoursForm extends TypedFormGroup<OperationHours> {

  readonly timeRangeErrStateMatcher: ErrorStateMatcher;

  constructor(operationHours?: Partial<OperationHours>) {
    super({
      id: undefined,
      weekday: null,
      startTime: '',
      endTime: ''
    });
    this.setValidators([
      this._timeRangeOrderValidator,
      this._allOrNothingOpHoursValidator
    ]);
    this.timeRangeErrStateMatcher = this._genTimeRangeErrStateMatcher();
    if (operationHours) {
      this.patchValue(operationHours);
    }
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
