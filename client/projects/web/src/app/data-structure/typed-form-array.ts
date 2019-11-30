import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { TypedAbstractControl } from '~web/data-structure/typed-abstract-control';


export class TypedFormArray<T> extends FormArray {

  private _deepValueChanges = new Subject<Partial<T>[]>();

  constructor(
    public controls: TypedAbstractControl<T>[],
    public memberInit?: () => TypedAbstractControl<T>,
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
      this.at(this.length - 1).valueChanges.subscribe(this._onElementValueChanges.bind(this, this.at(this.length - 1)));
    } else {
      this._addNeededMembers(this.length + 1);
      this.at(this.length - 1).patchValue(value);
    }
    this.markAsDirty();
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
    this.memberInit = (this.memberInit ? this.memberInit : () => new FormControl());
    while (this.length < length) {
      const memberCopy: TypedAbstractControl<T> = this.memberInit();
      this.controls.push(memberCopy);
      this.at(this.length - 1).valueChanges.subscribe(this._onElementValueChanges.bind(this, this.at(this.length - 1)));
    }
  }

  private _onElementValueChanges(source: AbstractControl): void {
    this.updateValueAndValidity();
    if (source.dirty) {
      this.markAsDirty();
    }
    this._deepValueChanges.next(this.value);
  }
}
