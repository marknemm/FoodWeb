import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Controls } from '~web/forms/interfaces/form-type-util';

export type GroupRequiredValidationMode = 'all' | 'allOrNothing' | 'none';

/**
 * A stateless service that contains form validation utility methods.
 */
@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  /**
   * Adds validator(s) to controls within a given `form`.
   * @param form The `FormGroup` whose controls will have validator(s) added to them.
   * @param validators An object literal map of form control name keys to validator(s) values.
   */
  addValidators<T extends Controls>(form: FormGroup<T>, validators: { [K in keyof T]?: ValidatorFn | ValidatorFn[] }): void;

  /**
   * Adds `validators` to all `controls` directly inside a given `form`.
   * @param form The `FormGroup` whose `controls` will have `validators` added to them.
   * @param validators The validator(s) that shall be added.
   * @param controls A list of the names of `controls` in `form` to add the `validators` to.
   */
  addValidators<T extends Controls>(form: FormGroup<T>, validators: ValidatorFn | ValidatorFn[], controls: (keyof T)[]): void;

  addValidators<T extends Controls>(
    form: FormGroup<T>,
    validators: ValidatorFn | ValidatorFn[] | { [K in keyof T]?: ValidatorFn | ValidatorFn[] },
    controls?: (keyof T)[]
  ): void {
    if (form) {
      if (validators instanceof Object && !controls) {
        for (const key in validators) {
          form.controls[key].addValidators(validators[key]);
          form.controls[key].updateValueAndValidity();
        }
      } else if (validators && controls) {
        for (const control of controls) {
          form.controls[control as string].addValidators(validators);
          form.controls[control as string].updateValueAndValidity();
        }
      }
    }
  }

  /**
   * Generates a validator function for recursively validating the required status of a form group's members
   * based off of a given validation mode.
   * @param form The `FormGroup` that is to be validated.
   * @param validationMode The `GroupRequiredValidationMode` that is to be used.
   * @param excludeMap A map of the fields to exclude from the required validation.
   * @param validationMsg The validation message that should be displayed upon invalid form state.
   * @return The validator function.
   */
  groupRequiredValidator(
    form: FormGroup,
    validationMode: GroupRequiredValidationMode = 'none',
    excludeMap: object = {},
    validationMsg = 'Must fill in all fields'
  ): ValidatorFn {
    return () => {
      const presenceResults = this._determineGroupMemberPresence(form, excludeMap);
      switch (validationMode) {
        case 'all':           return (presenceResults.allPresent)
          ? null
          : { groupRequired: validationMsg };
        case 'allOrNothing':  return (presenceResults.allPresent || !presenceResults.somePresent)
          ? null
          : { groupRequired: validationMsg };
      }
      return null; // 'none'
    };
  }

  /**
   * Determines the group member presence within a given form group and recursively in any of its children.
   * @param formGroup The `FormGroup` that is to be checked for member presence.
   * @param excludeMap A map of the fields to exclude from validation.
   * @return An object containing the member presence status of all members within the given form group.
   */
  private _determineGroupMemberPresence(formGroup: FormGroup, excludeMap: object): { allPresent: boolean, somePresent: boolean } {
    const results = {
      allPresent: true,
      somePresent: false
    };

    for (const controlName in formGroup.controls) {
      if (!excludeMap || !excludeMap[controlName]) {
        const control: AbstractControl = formGroup.get(controlName);
        if (control instanceof FormGroup) {
          const childResults = this._determineGroupMemberPresence(control, excludeMap ? excludeMap[controlName] : null);
          results.allPresent = results.allPresent && childResults.allPresent;
          results.somePresent = results.somePresent && childResults.somePresent;
        } else {
          results.allPresent = results.allPresent && !!control.value;
          results.somePresent = results.somePresent || !!control.value;
        }
      }
    }

    return results;
  }

  /**
   * Synchronizes validation from one control to another.
   * @param fromControl The control to sync the validation from.
   * @param toControl The control to sync the validation to.
   */
  syncValidation(fromControl: AbstractControl, toControl: AbstractControl): void {
    if (fromControl && toControl) {
      // Record fromControl validators prior to syncing with toControl validators.
      const fromControlValidator = fromControl.validator?.bind(fromControl, fromControl)
                            ?? (() => null as ValidationErrors);

      // Record toControl validators prior to syncing with fromControl validators.
      const toControlValidator = toControl.validator?.bind(toControl, toControl)
                            ?? (() => null as ValidationErrors);

      // Sync fromControl validators into toControl validators.
      toControl.setValidators(() => toControlValidator() ?? fromControlValidator());
      toControl.updateValueAndValidity();
    }
  }
}
