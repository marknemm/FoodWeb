import { FormArray, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { TypedAbstractControl } from './typed-abstract-control';
import { FormHelperService } from '../shared/services/form-helper/form-helper.service';

export class TypedFormArray<T> extends FormArray {

  private readonly _formHelper = new FormHelperService(new FormBuilder());
  private _deepValueChanges = new Subject<Partial<T>[]>();

  constructor(
    controls: TypedAbstractControl<T>[],
    public memberTmpl?: TypedAbstractControl<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    this.valueChanges.subscribe(() => this._deepValueChanges.next(this.value));
  }

  get deepValueChanges(): Observable<Partial<T>[]> {
    return this._deepValueChanges.asObservable();
  }

  patchValue(value: Partial<T>[], options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    this._restructureFormArray(value.length);
    super.patchValue(value, options);
  }

  push(value: Partial<T>): void;
  push(control: TypedAbstractControl<T>): void;
  push(value: TypedAbstractControl<T> | Partial<T>): void {
    if (value instanceof FormControl || value instanceof FormArray || value instanceof FormGroup) {
      super.push(value);
    } else {
      this._addNeededMembers(this.length + 1);
      this.at(this.length - 1).patchValue(value);
    }
    this.at(this.length - 1).valueChanges.subscribe(this._onElementValueChanges.bind(this));
  }

  removeAt(index: number): void {
    super.removeAt(index);
    super.markAsDirty();
  }

  reset(value: Partial<T>[] = [], options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    if (value instanceof Array) {
      this._restructureFormArray(value.length);
    }
    super.reset(value, options);
  }

  setValue(value: Partial<T>[], options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    this._restructureFormArray(value.length);
    super.setValue(value, options);
  }

  private _restructureFormArray(length: number): void {
    this._removeExcessMembers(length);
    this._addNeededMembers(length);
  }

  private _removeExcessMembers(length: number): void {
    while (this.length > length) {
      this.controls.pop();
    }
  }

  private _addNeededMembers(length: number): void {
    this.memberTmpl = (this.memberTmpl ? this.memberTmpl : new FormControl());
    while (this.length < length) {
      const memberTmplCopy: TypedAbstractControl<T> = this._formHelper.copyAbstractControl(this.memberTmpl);
      if (memberTmplCopy instanceof TypedFormArray) {
        memberTmplCopy.memberTmpl = this.memberTmpl;
      }
      this.controls.push(memberTmplCopy);
      this.at(this.length - 1).valueChanges.subscribe(this._onElementValueChanges.bind(this));
    }
  }

  private _onElementValueChanges(): void {
    this.updateValueAndValidity();
    this._deepValueChanges.next(this.value);
  }
}
