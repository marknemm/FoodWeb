import { AbstractControl } from '@angular/forms';
import { Control } from '~web/forms/interfaces/form-type-util';

/**
 * Configures a `FormFieldService` by specifying how a injected/registered form control interacts with
 * a default `ControlValueAccessor` interface.
 *
 * Additionally, contains some configuration for control injection/registration.
 *
 * @param FORM_T The type of the form control managed by the `FormFieldService`.
 */
export interface FormFieldConfig<
  VIEW_MODEL_T,
  CONTROL_T extends AbstractControl = Control<VIEW_MODEL_T>,
  EXTERNAL_VIEW_MODEL_T = VIEW_MODEL_T
> {

  /**
   * Set to true if the default (value) change emitter should be omitted from use.
   * The default change emitter listens for all emitted `valueChanges` within the registered `AbstractControl`.
   * When set to true, the component is in charge of invoking `emitChange` whenever an outgoing change should be emitted.
   * Defaults to `false`.
   */
  omitDefaultChangeEmitter?: boolean;

  /**
   * Set to true if the default touched (blur) emitter should be omitted from use.
   * The default touched emitter listens for all invocations of `markAsTouched` within the registered `AbstractControl`.
   * When set to true, the component is in charge of invoking `emitTouched` whenever a touched/blur event occurs.
   * Defaults to `false`.
   */
  omitDefaultTouchedEmitter?: boolean;

  /**
   * Whether or not to sync validation setup on an internally registered control with validation on a bound external control.
   *
   * Defaults to `false`.
   */
  syncValidation?: boolean;

  /**
   * A callback function that is invoked to generate and register a fallback {@link AbstractControl}
   * if injection is not possible or if a `null` control is registered.
   *
   * Defaults to generating a basic `FormControl`.
   *
   * @return The fallback {@link AbstractControl} that is to be generated upon injection/registration failure.
   */
  genDefault?(): CONTROL_T;

  /**
   * Converts values coming into the component from externally bound form controls. Defaults to an `identity` function.
   *
   * `Note`: Does not apply if the internal control was injected from the outside.
   *
   * @param value The value that is to be converted, which is coming into the component from the outside.
   * @returns The converted value.
   */
  valueInConverter?(value: EXTERNAL_VIEW_MODEL_T): VIEW_MODEL_T;

  /**
   * Converts values going out of the component from the internal form control. Defaults to an `identity` function.
   *
   * `Note`: Does not apply if the internal control was injected from the outside.
   *
   * @param value The value that is to be converted, which is going out from within the component.
   * @returns The converted value.
   */
  valueOutConverter?(value: VIEW_MODEL_T): EXTERNAL_VIEW_MODEL_T;

}
