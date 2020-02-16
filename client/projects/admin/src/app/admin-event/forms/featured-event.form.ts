import { Validators } from '@angular/forms';
import { FeaturedEvent } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { ErrorStateMatcher } from '@angular/material/core';
export { FeaturedEvent };

export class FeaturedEventForm extends TypedFormGroup<FeaturedEvent> {

  /**
   * Ensures that the date-time component's error state updates when form submit is attempted.
   */
  readonly dateErrorStateMatcher = new ErrorStateMatcher();

  constructor(event?: Partial<FeaturedEvent>) {
    super({
      id: undefined,
      city: [ undefined, Validators.required ],
      date: [ undefined, Validators.required ],
      description: [ undefined, Validators.required ],
      durationMins: [ undefined, Validators.pattern(/^[0-9]*$/) ],
      postalCode: [ undefined, Validators.required ],
      showUntil: undefined,
      signupCompleteMsg: [ undefined, Validators.required ],
      signupTitle: [ undefined, Validators.required ],
      stateProvince: [ undefined, Validators.required ],
      streetAddress: [ undefined, Validators.required ],
      title: [ undefined, Validators.required ]
    });
    this.enableSignupFields(false); // Default signup fields to disabled.
    if (event) {
      this.patchValue(event);
    }
    this.dateErrorStateMatcher.isErrorState = () => this.get('date').invalid && (this.get('date').touched || this.get('date').dirty);
  }

  /**
   * Gets the featured event form value, refined for submission.
   */
  get submitValue(): FeaturedEvent {
    const featuredEvent: FeaturedEvent = this.value;
    // Must explicitly set signup fields to empty strings if disabled so that empty value will be saved.
    if (this.get('signupTitle').disabled) {
      featuredEvent.signupTitle = '';
      featuredEvent.signupCompleteMsg = '';
    }
    return featuredEvent;
  }

  /**
   * Sets the enable state of this form's signup fields.
   * @param enable The enable state of the signup fields.
   */
  enableSignupFields(enable: boolean): void {
    if (enable) {
      this.get('signupCompleteMsg').enable();
      this.get('signupTitle').enable();
    } else {
      this.get('signupCompleteMsg').disable();
      this.get('signupTitle').disable();
    }
  }

  /**
   * @override
   */
  patchValue(value: Partial<FeaturedEvent>, options?: { onlySelf?: boolean, emitEvent?: boolean }): void {
    super.patchValue(value, options);
    // Update enabled state of signup fields based off of presence of a value.
    this.enableSignupFields(!!this.get('signupTitle').value || !!this.get('signupCompleteMsg').value);
  }
}
