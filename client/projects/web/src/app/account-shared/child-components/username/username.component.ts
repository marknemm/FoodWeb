import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TypedFormControl } from '~web/data-structure/typed-form-control';

@Component({
  selector: 'foodweb-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UsernameComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => UsernameComponent), multi: true }
  ]
})
export class UsernameComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @Input() editing = false;

  usernameCtrl = new TypedFormControl<string>('', Validators.required);

  private _destroy$ = new Subject();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._destroy$.next();
  }

  writeValue(value: string): void {
    this.usernameCtrl.setValue(value, { emitEvent: false });
  }

  registerOnChange(onChangeCb: (value: string) => void): void {
    this.usernameCtrl.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(onChangeCb);
  }

  validate(): ValidationErrors {
    return (this.usernameCtrl.invalid ? { invalid: true } : null);
  }

  registerOnTouched(): void {}
}
