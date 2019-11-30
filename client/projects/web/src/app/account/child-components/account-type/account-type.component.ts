import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountType } from '~shared';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { ConstantsService } from '~web/shared/constants/constants.service';

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

  accountTypeCtrl = new TypedFormControl<AccountType>(null, Validators.required);

  private _destroy$ = new Subject();

  constructor(
    public constantsService: ConstantsService
  ) {}

  ngOnInit() {}

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
