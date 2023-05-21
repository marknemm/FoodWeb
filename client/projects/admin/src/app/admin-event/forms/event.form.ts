import { FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FeaturedEvent } from '~shared';
import { Controls, toControls } from '~web/forms';
export { FeaturedEvent };

export class EventForm extends FormGroup<EventControls> {

  /**
   * Ensures that the date-time component's error state updates when form submit is attempted.
   */
  readonly dateErrorStateMatcher = new ErrorStateMatcher();

  constructor(event?: Partial<FeaturedEvent>) {
    super(toControls({
      id: undefined as number,
      city: [ undefined as string, Validators.required ],
      date: [ undefined as Date, Validators.required ],
      description: [ undefined as string, Validators.required ],
      durationMins: [ undefined as number, Validators.pattern(/^[0-9]*$/) ],
      postalCode: [ undefined as string, Validators.required ],
      showUntil: undefined as Date,
      signupCompleteMsg: [ undefined as string, Validators.required ],
      signupTitle: [ undefined as string, Validators.required ],
      stateProvince: [ undefined as string, Validators.required ],
      streetAddress: [ undefined as string, Validators.required ],
      title: [ undefined as string, Validators.required ]
    }));
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
    const featuredEvent: FeaturedEvent = this.getRawValue();
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

export type EventControls = Controls<EventFormData>;
export type EventFormData = FeaturedEvent;
