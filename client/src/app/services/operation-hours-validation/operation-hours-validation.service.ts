import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class OperationHoursValidationService implements ErrorStateMatcher {

  constructor() {}

  operationHoursOrder(form: FormGroup): { operationHoursOrder: string } {
    const startTime: string = form.get('startTime').value;
    const endTime: string = form.get('endTime').value;
    return (!startTime || !endTime || new Date(`1/1/2000 ${startTime}`) < new Date(`1/1/2000 ${endTime}`)) ?
      null :
      { operationHoursOrder: 'Start time must be earlier than end time' };
  }

  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    if (control === form.control.get('startTime') || control === form.control.get('endTime')) {
      if (form.hasError('operationHoursOrder')) {
        return true;
      }
    }
    return (control && control.invalid && control.touched);
  }
}
