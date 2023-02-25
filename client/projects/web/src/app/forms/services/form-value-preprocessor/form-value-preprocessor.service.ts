import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { FlexFormArray } from '~web/forms/classes/flex-form-array';

/**
 * A stateless service that preprocesses a value and form control before the value is set to the control.
 * Auto-corrects simple errors in the best way possible by modifying the control and value when necessary.
 * @param V The type of the raw form control value.
 */
@Injectable({
  providedIn: 'root'
})
export class FormValuePreprocessorService<V> {

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
  autoPreprocess(control: AbstractControl): void {
    const origPatchValue = control.patchValue.bind(control);
    control.patchValue = (value: any, options: object) => {
      value = this.preprocess(control, value);
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
   * Preprocesses a given value that shall be set to a given form control.
   *
   * If the value is null/undefined, will ensure that it is transformed to a value that will not render an error if
   * the control is a FormGroup (object with null properties) or FormArray (empty array).
   *
   * If the value is an array that doesn't match the size of a given FormArray control, then the FormArray will be auto-resized.
   *
   * @param control The {@link AbstractControl} that will have its value set.
   * @param value The value that shall be set.
   * @returns The resulting preprocessed value.
   */
  preprocess(control: AbstractControl, value: V): V {
    if (value == null) {
      value = this._autoCorrectNullValue(control, value);
    }

    if (control instanceof UntypedFormArray && !(control instanceof FlexFormArray)) {
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
    const formArray: UntypedFormArray = (control as any); // Should know control is FormArray once here.

    // If not enough controls in FormArray, then clone last one and push until resized correctly.
    if (value.length > formArray.length) {
      for (let i = 0; i <= value.length - formArray.length; i++) {
        formArray.push(new FormControl<V>(null));
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
  private _autoCorrectNullValue(control: AbstractControl, value: any): V {
    // Protect against setting null/undefined value in FormArray/Group (would result in error).
    if (control instanceof UntypedFormGroup) {
      value = <any>{}; // Must maintain structure of contained FormGroup.
      for (const key of Object.keys(control.controls)) {
        value[key] = null;
      }
    } else if (control instanceof UntypedFormArray) {
      value = ([] as any);
    }
    return value;
  }

}
