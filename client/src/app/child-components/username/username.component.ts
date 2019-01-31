import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormBuilder, Validators, ValidationErrors, ControlValueAccessor, Validator } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'food-web-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UsernameComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => UsernameComponent), multi: true }
  ]
})
export class UsernameComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @Input() editing = false;

  usernameCtrl: FormControl;

  private $_destroy = new Subject();

  constructor(
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.usernameCtrl = this._formBuilder.control('', Validators.required);
  }

  ngOnDestroy() {
    this.$_destroy.next();
    this.$_destroy.complete();
  }

  writeValue(value: string): void {
    this.usernameCtrl.setValue(value, { emitEvent: false });
  }

  registerOnChange(onChangeCb: (value: string) => void): void {
    this.usernameCtrl.valueChanges.pipe(
      takeUntil(this.$_destroy)
    ).subscribe(onChangeCb);
  }

  validate(): ValidationErrors {
    return (this.usernameCtrl.invalid ? { invalid: true } : null);
  }

  registerOnTouched(): void {}
}
