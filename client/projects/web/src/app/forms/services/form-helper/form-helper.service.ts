import { Host, Injectable, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

@Injectable()
export class FormHelperService {

  constructor(
    @Optional() @Host() @SkipSelf()
    private _controlContainer: ControlContainer,
  ) {}

  /**
   * The containing `FormGroup` of the control bound to the injected component.
   */
  get containingFormGroup(): FormGroup {
    return (this._controlContainer.control instanceof FormGroup) ? this._controlContainer.control : null;
  }

  /**
   * Derives an abstract control via a given control name and instance.
   * Gives precedence to deriving the control from the control name. If the control name is empty, then resorts to using the passed in instance.
   * @param controlName The abstract control's name.
   * @param control The abstract control instance.
   * @return The derived abstract control.
   */
  deriveAbstractControl<T extends AbstractControl>(controlName: string, control: T): T {
    return (this._controlContainer && controlName)
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
   * Maps various statuses from a given source abstract control to a destination abstract control.
   * The mapped statuses include: dirty/pristine, touched/untouched, allTouched, & pending.
   * @param sourceControl The source `AbstractControl` for the status mapping.
   * @param destControl The destination `AbstractControl` for the status mapping.
   */
  mapControlStatuses(sourceControl: AbstractControl, destControl: AbstractControl): void {
    this.onDisable(sourceControl, () => destControl.disable());
    this.onEnable(sourceControl, () => destControl.enable());
    this.onMarkAllAsTouched(sourceControl, () => destControl.markAllAsTouched());
    this.onMarkAsDirty(sourceControl, (opts: { onlySelf?: boolean }) => destControl.markAsDirty(opts));
    this.onMarkAsPending(sourceControl, (opts: { onlySelf?: boolean, emitEvent?: boolean }) => destControl.markAsPending(opts));
    this.onMarkAsPristine(sourceControl, (opts: { onlySelf?: boolean }) => destControl.markAsPristine(opts));
    this.onMarkAsTouched(sourceControl, (opts: { onlySelf?: boolean }) => destControl.markAsTouched(opts));
    this.onMarkAsUntouched(sourceControl, (opts: { onlySelf?: boolean }) => destControl.markAsUntouched(opts));
  }

  /**
   * Listens for disable to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param disableCb The callback function.
   */
   onDisable(abstractControl: AbstractControl, disableCb: () => void): void {
    const origDisable: Function = abstractControl.disable.bind(abstractControl);
    abstractControl.disable = () => {
      origDisable.apply(abstractControl);
      disableCb();
    };
  }

  /**
   * Listens for enable to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param enableCb The callback function.
   */
   onEnable(abstractControl: AbstractControl, enableCb: () => void): void {
    const origEnable: Function = abstractControl.enable.bind(abstractControl);
    abstractControl.enable = () => {
      origEnable.apply(abstractControl);
      enableCb();
    };
  }

  /**
   * Listens for markAllAsTouched to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param allTouchedCb The callback function.
   */
  onMarkAllAsTouched(abstractControl: AbstractControl, allTouchedCb: () => void): void {
    const origMarkAllAsTouched: Function = abstractControl.markAllAsTouched.bind(abstractControl);
    abstractControl.markAllAsTouched = () => {
      origMarkAllAsTouched();
      allTouchedCb();
    };
  }

  /**
   * Listens for markAsDirty to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param dirtyCb The callback function.
   */
  onMarkAsDirty(abstractControl: AbstractControl, dirtyCb: (opts?: { onlySelf?: boolean }) => void): void {
    const origMarkAsDirty: Function = abstractControl.markAsDirty.bind(abstractControl);
    abstractControl.markAsPristine = (opts: { onlySelf?: boolean }) => {
      origMarkAsDirty.apply(abstractControl, opts);
      dirtyCb(opts);
    };
  }

  /**
   * Listens for markAsPending to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param pendingCb The callback function.
   */
   onMarkAsPending(abstractControl: AbstractControl, pendingCb: (opts?: { onlySelf?: boolean, emitEvent?: boolean }) => void): void {
    const origMarkAsPending: Function = abstractControl.markAsPending.bind(abstractControl);
    abstractControl.markAsPending = (opts: { onlySelf?: boolean, emitEvent?: boolean }) => {
      origMarkAsPending.apply(abstractControl, opts);
      pendingCb(opts);
    };
  }

  /**
   * Listens for markAsPristine to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param pristineCb The callback function.
   */
   onMarkAsPristine(abstractControl: AbstractControl, pristineCb: (opts?: { onlySelf?: boolean }) => void): void {
    const origMarkAsPristine: Function = abstractControl.markAsPristine.bind(abstractControl);
    abstractControl.markAsPristine = (opts: { onlySelf?: boolean }) => {
      origMarkAsPristine.apply(abstractControl, opts);
      pristineCb(opts);
    };
  }

  /**
   * Listens for markAsTouched to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param touchedCb The callback function.
   */
  onMarkAsTouched(abstractControl: AbstractControl, touchedCb: (opts?: { onlySelf?: boolean }) => void): void {
    const origMarkAsTouched: Function = abstractControl.markAsTouched.bind(abstractControl);
    abstractControl.markAsTouched = (opts: { onlySelf?: boolean }) => {
      origMarkAsTouched.apply(abstractControl, opts);
      touchedCb(opts);
    };
  }

  /**
   * Listens for markAsUntouched to be invoked on a given abstract control, and then invokes a given callback function.
   * @param abstractControl The abstract control.
   * @param untouchedCb The callback function.
   */
  onMarkAsUntouched(abstractControl: AbstractControl, untouchedCb: (opts?: { onlySelf?: boolean }) => void): void {
    const origMarkAsUntouched: Function = abstractControl.markAsUntouched.bind(abstractControl);
    abstractControl.markAsUntouched = (opts: { onlySelf?: boolean }) => {
      origMarkAsUntouched.apply(abstractControl, opts);
      untouchedCb(opts);
    };
  }

}
