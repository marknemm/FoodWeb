import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import {
  FormBuilder, Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS,
  ControlValueAccessor, Validator, ValidationErrors, FormControl
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConstantsService } from '../../../shared/services/constants/constants.service';
import { AccountType } from '../../../../../../shared/src/interfaces/account/account';

@Component({
  selector: 'food-web-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AccountTypeComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => AccountTypeComponent), multi: true }
  ]
})
export class AccountTypeComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @Input() editing = false;

  accountTypeCtrl: FormControl;

  private _destroy$ = new Subject();

  constructor(
    public constantsService: ConstantsService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.accountTypeCtrl = this._formBuilder.control('', Validators.required);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  writeValue(value: AccountType): void {
    this.accountTypeCtrl.patchValue(value, { emitEvent: false });
  }

  registerOnChange(onChangeCb: (value: AccountType) => void): void {
    this.accountTypeCtrl.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(onChangeCb);
  }

  validate(): ValidationErrors {
    return (this.accountTypeCtrl.invalid ? { invalid: true } : null);
  }

  accountTypeClick(accountType: AccountType): void {
    if (this.editing) {
      this.accountTypeCtrl.setValue(accountType);
    }
  }

  registerOnTouched(): void {}

}
