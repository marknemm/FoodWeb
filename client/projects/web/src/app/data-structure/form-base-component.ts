import { Component, forwardRef, Input, OnDestroy, OnInit, Provider, Type } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TypedAbstractControl } from '~web/data-structure/typed-abstract-control';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

/**
 * Base class that implements fundamental ControlValueAccessor functionality.
 * It also initializes a TypedFormControl or TypedFormGroup based off of input bindings that are set on the derived component.
 */
@Component({ template: '' })
export abstract class FormBaseComponent<T> implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() formControlName = '';
  @Input() formGroupName = '';
  @Input() set formControl(control: TypedFormControl<T>) { this._formControl = control; }
  @Input() set formGroup(group: TypedFormGroup<T>) { this._formGroup = group; }

  protected _destroy$ = new Subject();

  private _controlInputBound = false;
  private _formControl: TypedFormControl<T>;
  private _formGroup: TypedFormGroup<T>;
  private _onChangeCb: (value: T) => void = () => {};
  private _onTouchedCb = () => {};

  constructor(
    protected _formHelperService: FormHelperService
  ) {}

  /**
   * The active abstract control derived within this form component base; either a FormGroup or FormControl.
   * @throws An error when accessed if an abstract control was never set on this component.
   */
  get activeAbstractControl(): TypedAbstractControl<T> {
    const abstractControl: TypedAbstractControl<T> = (this._formGroup) ? this._formGroup : this._formControl;
    if (!abstractControl) {
      throw new Error('FormBaseComponent never initialized its internal formGroup/formControl. Did you forget to call super.ngOnInit()?');
    }
    return abstractControl;
  }

  /**
   * Whether or not the derived active abstract control (either formGroup or formControl) was supplied as an input binding.
   */
  get controlInputBound(): boolean {
    return this._controlInputBound;
  }

  /**
   * The form control that is set on the component.
   * @throws An error when accessed if the form control was never initialized on the component.
   */
  get formControl(): TypedFormControl<T> {
    if (!this._formControl) {
      throw new Error('FormBaseComponent never intialized its internal formControl. Did you forget to call super.ngOnInit()?');
    }
    return this._formControl;
  }

  /**
   * The form group that is set on the component.
   * @throws An error when accessed if the form group was never initialized on the component.
   */
  get formGroup(): TypedFormGroup<T> {
    if (!this._formGroup) {
      throw new Error('FormBaseComponent never intialized its internal formGroup. Did you forget to call super.ngOnInit()?');
    }
    return this._formGroup;
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

  ngOnInit() {
    this._controlInputBound = !!(this.formGroupName || this._formGroup || this.formControlName || this._formControl);
    this._formControl = this._formControl ? this._formControl : new TypedFormControl<T>(); // Set default for fallback if cannot derive.
    this._formGroup = this._formHelperService.deriveAbstractControl(this.formGroupName, this._formGroup);
    this._formControl = this._formHelperService.deriveAbstractControl(this.formControlName, this._formControl);
  }

  ngOnDestroy() {
    this._destroy$.next(); // Cleanup form related RxJS subscriptions.
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
  onValueChanges<C>(ctrl: TypedAbstractControl<C> & AbstractControl): Observable<C> {
    return ctrl.valueChanges.pipe(takeUntil(this._destroy$));
  }
}

/**
 * Generates a basic component level providers array containing NG_VALUE_ACCESSOR and FormHelperService providers.
 * @param component The component type.
 * @return The basic component level providers array for components that extend FormBaseComponent.
 */
export function valueAccessorProvider(component: Type<FormBaseComponent<any>>): Provider[] {
  return [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => component), multi: true },
    FormHelperService
  ];
}
