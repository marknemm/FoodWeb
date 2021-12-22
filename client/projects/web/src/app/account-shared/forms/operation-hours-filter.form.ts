import { AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { OperationHours } from '~shared';
import { TFormControlMembers, TFormGroup } from '~web/forms';
import { FormValidationService, GroupRequiredValidationMode } from '~web/forms/services/form-validation/form-validation.service';

export class OperationHoursFilterForm extends TFormGroup<OperationHours> {

  readonly timeRangeErrStateMatcher: ErrorStateMatcher;

  private _formValidation = new FormValidationService(); // TODO

  constructor(operationHours: TFormControlMembers<OperationHours> = {}, validationMode: GroupRequiredValidationMode = 'allOrNothing') {
    super({
      id: operationHours?.id,
      weekday: operationHours?.weekday,
      startTime: operationHours?.startTime ?? '',
      endTime: operationHours?.endTime ?? ''
    });
    this.setValidators([
      this._timeRangeOrderValidator.bind(this),
      this._formValidation.groupRequiredValidator(this, validationMode, { id: true })
    ]);
    this.timeRangeErrStateMatcher = this._genTimeRangeErrStateMatcher();
  }

  get startTime(): string {
    return this.get('startTime').value;
  }

  get endTime(): string {
    return this.get('endTime').value;
  }

  private _timeRangeOrderValidator(form: AbstractControl): { timeRangeOrder: string } | null {
    const startTime: string = form.get('startTime').value;
    const endTime: string = form.get('endTime').value;
    return (startTime && endTime && new Date(`1/1/2000 ${startTime}`) >= new Date(`1/1/2000 ${endTime}`))
      ? { timeRangeOrder: 'Start time must be earlier than end time' }
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
