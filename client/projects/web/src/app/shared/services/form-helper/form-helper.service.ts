import { Injectable, Optional, Host, SkipSelf } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';

@Injectable()
export class FormHelperService {

  constructor(
    @Optional() @Host() @SkipSelf()
    private _controlContainer: ControlContainer,
  ) {}

  /**
   * Derives an abstract control via a given control name and instance.
   * Gives precedence to deriving the control from the control name. If the control name is empty, then resorts to using the passed in instance.
   * @param controlName The abstract control's name.
   * @param control The abstract control instance.
   * @return The derived abstract control.
   */
  deriveAbstractControl<T extends AbstractControl>(controlName: string, control: T): T {
    return (controlName)
      ? <T>this._controlContainer.control.get(controlName)
      : control;
  }

  /**
   * Determines if a given abstract control has a required validator.
   * @param abstractControl The abstract control to test.
   * @return true if it has a required validator, false if not.
   */
  hasRequiredValidator(abstractControl: AbstractControl): boolean {
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      return (validator && validator.required);
    }
    return false;
  }

  /**
   * Listens for markAsTouched to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param touchedCb The callback function.
   */
  onMarkAsTouched(abstractControl: AbstractControl, touchedCb: () => void): void {
    const origMarkAsTouched: Function = abstractControl.markAsTouched;
    abstractControl.markAsTouched = function () {
      origMarkAsTouched.apply(abstractControl, arguments);
      touchedCb();
    };
  }

  /**
   * Listens for markAsPristine to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param pristineCb The callback function.
   */
  onMarkAsPristine(abstractControl: AbstractControl, pristineCb: () => void): void {
    const origMarkAsPristine: Function = abstractControl.markAsPristine;
    abstractControl.markAsPristine = function () {
      origMarkAsPristine.apply(abstractControl, arguments);
      pristineCb();
    };
  }
}
