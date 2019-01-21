import { Injectable } from '@angular/core';
import { FormGroup, FormGroupDirective, FormArray, FormBuilder, FormControl, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormHelperService {

  constructor(
    private _formBuilder: FormBuilder
  ) {}

  deriveFormArray(formArray: FormArray, formArrayName: string, formGroupDirective: FormGroupDirective): FormArray {
    if (formArray) {
      return formArray;
    }
    if (formGroupDirective && formGroupDirective.form && formGroupDirective.form.get(formArrayName) instanceof FormGroup) {
      return (formGroupDirective.form.get(formArrayName) as FormArray);
    }
    return new FormArray([]);
  }

  deriveFormGroup(formGroup: FormGroup, formGroupName: string, formGroupDirective: FormGroupDirective): FormGroup {
    if (formGroup) {
      return formGroup;
    }
    if (formGroupDirective && formGroupDirective.form && formGroupDirective.form.get(formGroupName) instanceof FormGroup) {
      return (formGroupDirective.form.get(formGroupName) as FormGroup);
    }
    return new FormGroup({});
  }

  addMissingControls(toForm: FormGroup, fromForm: FormGroup): void;
  addMissingControls(toForm: FormGroup, fromControlsConfig: { [key: string]: any }): void;
  addMissingControls(toForm: FormGroup, formConfig: { [key: string]: any } | FormGroup): void {
    const fromForm: FormGroup = (formConfig instanceof FormGroup) ?
      formConfig :
      this._formBuilder.group(formConfig);
    Object.keys(fromForm.controls).forEach((controlKey: string) => {
      if (!toForm.get(controlKey)) {
        const controlOrig: AbstractControl = fromForm.get(controlKey);
        const controlCopy: AbstractControl = this.copyAbstractControl(controlOrig);
        toForm.addControl(controlKey, controlCopy);
      }
    });
  }

  copyAbstractControl(control: AbstractControl): AbstractControl {
    if (control instanceof FormControl) {
      return this.copyFormControl(control);
    }
    if (control instanceof FormGroup) {
      return this.copyFormGroup(control);
    }
    return this.copyFormArray(control as FormArray);
  }

  copyFormGroup(form: FormGroup): FormGroup {
    const formCopy = new FormGroup({});
    this.addMissingControls(formCopy, form);
    formCopy.setValidators(form.validator);
    formCopy.setAsyncValidators(form.asyncValidator);
    formCopy.patchValue(form.value);
    return formCopy;
  }

  copyFormArray(array: FormArray): FormArray {
    const arrayCopy = new FormArray([]);
    array.controls.forEach((control: AbstractControl) => {
      arrayCopy.push(this.copyAbstractControl(control));
    });
    arrayCopy.setValidators(array.validator);
    arrayCopy.setAsyncValidators(array.asyncValidator);
    return arrayCopy;
  }

  copyFormControl(control: FormControl): FormControl {
    return new FormControl(control.value, control.validator, control.asyncValidator);
  }
}
