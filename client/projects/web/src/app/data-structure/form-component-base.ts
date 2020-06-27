import { Directive, forwardRef, Input, OnDestroy, OnInit, Provider, Type } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TypedAbstractControl } from "~web/data-structure/typed-abstract-control";
import { TypedFormControl } from "~web/data-structure/typed-form-control";
import { TypedFormGroup } from "~web/data-structure/typed-form-group";
import { FormHelperService } from "~web/shared/form-helper/form-helper.service";

/**
 * @abstract
 * Base class that implements fundamental ControlValueAccessor functionality.
 * It also initializes a TypedFormControl or TypedFormGroup based off of input bindings that are set on the derived component.
 */
@Directive()
export abstract class FormComponentBase<T> implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() formControl: TypedFormControl<T>;
  @Input() formControlName = '';
  @Input() formGroup: TypedFormGroup<T>;
  @Input() formGroupName = '';

  protected _destroy$ = new Subject();

  private _controlInputBound = false;
  private _onChangeCb: (value: T) => void = () => {};
  private _onTouchedCb = () => {};

  constructor(
    protected _formHelperService: FormHelperService
  ) {}

  /**
   * Whether or not the derived active abstract control (either formGroup or formControl) was supplied as an input binding.
   */
  get controlInputBound(): boolean {
    return this._controlInputBound;
  }

  /**
   * The registered on change callback function that should be invoked with the updated value whenever a change is registered.
   * @param value The updated value.
   */
  get onChangeCb(): (value: T) => void {
    return this._onChangeCb;
  }

  /**
   * The registered on touched callback function that should be invoked whenever the contained form control is blurred.
   */
  get onTouchedCb(): () => void {
    return this._onTouchedCb;
  }

  /**
   * The active abstract control derived within this form component base; either a FormGroup or FormControl.
   */
  get activeAbstractControl(): TypedAbstractControl<T> {
    return (this.formGroup) ? this.formGroup : this.formControl;
  }

  ngOnInit() {
    this._controlInputBound = !!(this.formGroupName || this.formGroup || this.formControlName || this.formControl);
    this.formControl = this.formControl ? this.formControl : new TypedFormControl<T>(); // Set default for fallback if cannot derive.
    this.formGroup = this._formHelperService.deriveAbstractControl(this.formGroupName, this.formGroup);
    this.formControl = this._formHelperService.deriveAbstractControl(this.formControlName, this.formControl);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  /**
   * Writes a given value to the underlying active abstract control; either formGroup or formControl.
   * @param value The value to write.
   * @param options Options for the write operation (See AbstractControl.setValue for more details).
   */
  writeValue(value: T, options?: { onlySelf?: boolean, emitEvent?: boolean }): void {
    // Only set the underlying control's value if it was not supplied via an input binding.
    // This implies that there is no encompassing from group which has supplied the derived component with its form control.
    if (!this.controlInputBound) {
      this.activeAbstractControl.setValue(value, options);
    }
  }

  /**
   * Registers a given on change callback function, which should be invoked whenever a change is detected in the
   * underlying active abstract control; either formGroup or formControl.
   * @param onChangeCb The on change callback function.
   */
  registerOnChange(onChangeCb: (value: T) => void): void {
    this._onChangeCb = onChangeCb;
  }

  /**
   * Registers a given on touched callback function, which should be invoked whenever a blur event is detected
   * in the underlying view element.
   * @param onTouchedCb The on touched callback function.
   */
  registerOnTouched(onTouchedCb: () => void): void {
    this._onTouchedCb = onTouchedCb;
  }

  /**
   * Sets the disabled state of the underlying active abstract control; either formGroup or formControl.
   * @param isDisabled Whether or not disable should be set.
   */
  setDisabledState(isDisabled: boolean): void {
    if (!this.controlInputBound) {
      (isDisabled) ? this.activeAbstractControl.disable() : this.activeAbstractControl.enable();
    }
  }

  /**
   * Listens for value changes to occur within a given abstract control.
   * @return An observable that emits any value changes. Will automatically be unsubscribed from when component is destroyed.
   */
  onValueChanges(ctrl: AbstractControl): Observable<T> {
    return ctrl.valueChanges.pipe(takeUntil(this._destroy$));
  }
}

/**
 * Generates an NG_VALUE_ACCESSOR provider for a given component type.
 * @param component The component type.
 * @return The NG_VALUE_ACCESSOR provider.
 */
export function valueAccessorProvider(component: Type<FormComponentBase<any>>): Provider {
  return { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => component), multi: true };
}
