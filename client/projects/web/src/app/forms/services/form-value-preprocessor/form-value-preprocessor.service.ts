import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { isEmpty, isPlainObject, isUndefined } from 'lodash-es';
import { ObjectService } from '~web/shared/services/object/object.service';

/**
 * A stateless service that preprocesses a value and form control before the value is set to the control.
 * Auto-corrects simple errors in the best way possible by modifying the control and value when necessary.
 */
@Injectable({
  providedIn: 'root'
})
export class FormValuePreprocessorService {

  private readonly _formArrayInitializers = new Map<FormArray, () => AbstractControl>();

  constructor(
    private _objectService: ObjectService
  ) {}

  /**
   * Configures a given `FormArray` so that any value written to it will be preprocessed.
   *
   * If the value is null/undefined, will ensure that it is transformed to an empty array.
   *
   * If the value is an array that doesn't match the size of a given FormArray control, then the FormArray will be auto-resized.
   *
   * @param control The control that shall be configured to auto-preprocess write values.
   * @param formArrayInitializer An optional custom initializer that shall be used to generate members when auto-resizing the `FormArray`.
   */
  autoPreprocess(control: FormArray, formArrayInitializer?: () => AbstractControl): void;

  /**
   * Configures a given `AbstractControl` so that any value written to it will be preprocessed.
   *
   * If the value is null/undefined, will ensure that it is transformed to a value that will not render an error if
   * the control is a FormGroup (object with null properties) or FormArray (empty array).
   *
   * If the value is an array that doesn't match the size of a given FormArray control, then the FormArray will be auto-resized.
   *
   * @param control The control that shall be configured to auto-preprocess write values.
   */
  autoPreprocess(control: AbstractControl): void;

  autoPreprocess(control: AbstractControl, formArrayInitializer?: () => AbstractControl): void {
    if (!control) { return; }

    if (formArrayInitializer) {
      this._formArrayInitializers.set(control as FormArray, formArrayInitializer);
    }

    const origPatchValue = control.patchValue.bind(control);
    control.patchValue = (value: any, options: object) => {
      value = this.preprocess(control, value, (value: any) =>
            isUndefined(value)
        || (isPlainObject(value) && isEmpty(value)));
      return origPatchValue(value, options);
    };

    const origReset = control.reset.bind(control);
    control.reset = (value: any, options: object) => {
      value = this.preprocess(control, value);
      return origReset(value, options);
    };

    const origSetValue = control.setValue.bind(control);
    control.setValue = (value: any, options: object) => {
      value = this.preprocess(control, value);
      return origSetValue(value, options);
    };
  }

  /**
   * Preprocesses a given `AbstractControl` and its associated update value.
   *
   * If the value is `null`/`undefined`, will ensure that it is transformed to a value that will not render an error if
   * the control is a `FormGroup` (object with null properties) or `FormArray` (empty array).
   *
   * If the value is an array that doesn't match the size of a given `FormArray` control, then the `FormArray` will be auto-resized.
   *
   * @param control The {@link AbstractControl} that will have its value updated (may be internally modified).
   * @param value The update value.
   * @param omitByPredicate An optional predicate that shall be matched against every field in `value` recursively,
   * and if it returns `true`, then the field shall be deleted.
   * @returns The resulting preprocessed value.
   */
  preprocess<C extends AbstractControl<V>, V>(
    control: C,
    value: Partial<V>,
    omitByPredicate?: (memberValue: any) => boolean
  ): Partial<V> {
    if (!control) { return value; } // Handle bad input.

    if (omitByPredicate) {
      value = this._objectService.omitByRecursive(value, omitByPredicate);
    }

    if (value == null) {
      value = this._autoCorrectNullValue(control, value);
    }

    if (control instanceof FormArray) {
      this._autoCorrectFormArraySize(control, value as any);
    }

    return value;
  }

  /**
   * Auto-corrects the size of a given `FormArray` control to match the number of elements in a given array value.
   * @param control The `FormArray` control that is to have its size corrected if necessary.
   * @param value The array value that is to be set in the given control.
   */
  private _autoCorrectFormArraySize(control: AbstractControl, value: any[]): void {
    const formArray: FormArray = (control as any); // Should know control is FormArray once here.

    // If not enough controls in FormArray, then clone last one and push until resized correctly.
    if (value.length > formArray.length) {
      for (let i = 0; i <= value.length - formArray.length; i++) {
        (this._formArrayInitializers.has(formArray))
          ? formArray.push(this._formArrayInitializers.get(formArray)())
          : formArray.push(new FormControl<any>(null));
      }
    }

    // If too many controls in FormArray, then splice off extras.
    if (value.length < formArray.length) {
      formArray.controls.splice(value.length);
    }
  }

  /**
   * Auto-corrects any null/undefined value that is to be set to a given `FormGroup` or `FormArray` control.
   * If the control is a `FormControl`, then no correction occurs.
   * @param control The {@link AbstractControl} that is to have its value set.
   * @param value The null value that is to be preprocessed.
   * @return The pre-processed value.
   */
  private _autoCorrectNullValue(control: AbstractControl, value: any): any {
    // Protect against setting null/undefined value in FormArray/Group (would result in error).
    if (control instanceof FormGroup) {
      value = {}; // Must maintain structure of contained FormGroup.
      for (const key of Object.keys(control.controls)) {
        value[key] = null;
      }
    } else if (control instanceof FormArray) {
      value = ([] as any);
    }
    return value;
  }

  registerFormArrayInitializer(formArray: FormArray, initializer: () => AbstractControl): void {
    this._formArrayInitializers.set(formArray, initializer);
  }

}
