import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, Validators,
  FormArray, Validator, ValidationErrors, NG_VALIDATORS
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogService } from './../../../services/confirm-dialog/confirm-dialog.service';
import { OperationHoursValidationService } from '../../../services/operation-hours-validation/operation-hours-validation.service';
import { OperationHours } from './../../../../../../shared/src/interfaces/operation-hours';
import { Constants } from '../../../../../../shared/src/constants/constants';

type OnChangeCb = (operationHours: OperationHours[]) => void;

@Component({
  selector: 'food-web-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OperationHoursComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => OperationHoursComponent), multi: true } 
  ],
})
export class OperationHoursComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  readonly weekdays: string[] = Constants.WEEKDAYS;

  @Input() editing = false;

  operationHoursArr: FormArray;

  private $_destroy = new Subject();

  constructor(
    public opHrsValidationService: OperationHoursValidationService,
    private _formBuilder: FormBuilder,
    private _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.operationHoursArr = this._formBuilder.array([]);
  }

  ngOnDestroy() {
    // Prevent memory leak from form valueChanges observable.
    this.$_destroy.next();
    this.$_destroy.complete();
  }

  writeValue(value: OperationHours[]): void {
    value = (value ? value : []);
    this.operationHoursArr.setValue([], { emitEvent: false });
    value.forEach(
      (operationHours: OperationHours) => {
        const operationHoursForm: FormGroup = this._genOperationHoursForm(operationHours);
        this.operationHoursArr.push(operationHoursForm);
      }
    );
  }

  registerOnChange(onChangeCb: OnChangeCb): void {
    this.operationHoursArr.valueChanges.pipe(
      takeUntil(this.$_destroy)
    ).subscribe(
      () => onChangeCb(this.operationHoursArr.value)
    );
  }

  validate(): ValidationErrors {
    return (this.operationHoursArr.invalid ? { invalid: true } : null);
  }

  addOperationHours(): void {
    this.operationHoursArr.push(
      this._genOperationHoursForm({ weekday: null, startTime: '', endTime: '' })
    );
  }

  removeOperationHours(idx: number): void {
    if (this.operationHoursArr.at(idx).valid) {
      const confirmMsg = 'Are you sure you wish to delete the operation hours?';
      this._confirmDialogService.displayConfirmDialog(confirmMsg, 'Confirm Delete').subscribe(
        (confirm: boolean) => {
          if (confirm) {
            this.operationHoursArr.removeAt(idx);
          }
        }
      );
    } else {
      this.operationHoursArr.removeAt(idx);
    }
  }

  registerOnTouched(fn: any): void {}

  private _genOperationHoursForm(operationHours: OperationHours): FormGroup {
    return this._formBuilder.group(
      {
        weekday: [operationHours.weekday, Validators.required],
        startTime: [operationHours.startTime, Validators.required],
        endTime: [operationHours.endTime, Validators.required]
      },
      { validators: this.opHrsValidationService.operationHoursOrder }
    );
  }

}
