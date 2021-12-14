import { TAbstractControl } from '~web/forms/classes/t-abstract-control';

/**
 * Configures a `FormFieldService` by specifying how a injected/registered form control interacts with a default
 * `ControlValueAccessor` interface.
 *
 * Additionally, contains some configuration for control injection/registration.
 *
 * @param V The type of the value contained within the component provider's form control.
 * @param C The type of the component provider's form control. Defaults to `TAbstractControl<V>`.
 * @param E The optional type of the form data exposed to eternal bindings
 * (before {@link valueInConverter} and after {@link valueOutConverter}). Defaults to `V`.
 */
export interface FormFieldConfig<
  V,
  C extends TAbstractControl<V> = TAbstractControl<V>,
  E = V,
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
   * A callback function that is invoked to generate and register a fallback `AbstractControl` if injection is not possible.
   * Defaults to generating a basic `FormControl`.
   *
   * `Note`: Does not apply if the internal control is not injected.
   *
   * @return The fallback `AbstractControl` that is to be generated upon injection failure.
   */
  genDefault?: () => C;

  /**
   * Converts values coming into the component from externally bound form controls. Defaults to an `identity` function.
   *
   * `Note`: Does not apply if the internal control was injected from the outside.
   *
   * @param value The value that is to be converted, which is coming into the component from the outside.
   * @returns The converted value.
   */
  valueInConverter?: (value: E) => V;

  /**
   * Converts values going out of the component from the internal form control. Defaults to an `identity` function.
   *
   * `Note`: Does not apply if the internal control was injected from the outside.
   *
   * @param value The value that is to be converted, which is going out from within the component.
   * @returns The converted value.
   */
  valueOutConverter?: (value: V) => E;
}
