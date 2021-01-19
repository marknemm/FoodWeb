import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export type GroupRequiredValidationMode = 'all' | 'allOrNothing' | 'none';

/**
 * Generates a validator function for recursively validating the required status of a form group's members
 * based off of a given validation mode.
 * @param formGroup The `FormGroup` that is to be validated.
 * @param validationMode The `GroupRequiredValidationMode` that is to be used.
 * @param excludeMap A map of the fields to exclude from the required validation.
 * @param validationMsg The validation message that should be displayed upon invalid form state.
 * @return The validator function.
 */
export function groupRequiredValidator(
  formGroup: FormGroup,
  validationMode: GroupRequiredValidationMode,
  excludeMap: object = {},
  validationMsg = 'Must fill in all fields'
): ValidatorFn {
  return () => {
    const presenceResults = _determineGroupMemberPresence(formGroup, excludeMap);
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
function _determineGroupMemberPresence(formGroup: FormGroup, excludeMap: object): { allPresent: boolean, somePresent: boolean } {
  const results = {
    allPresent: true,
    somePresent: false
  };

  for (const controlName in formGroup.controls) {
    if (!excludeMap || !excludeMap[controlName]) {
      const control: AbstractControl = formGroup.get(controlName);
      if (control instanceof FormGroup) {
        const childResults = _determineGroupMemberPresence(control, excludeMap ? excludeMap[controlName] : null);
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
