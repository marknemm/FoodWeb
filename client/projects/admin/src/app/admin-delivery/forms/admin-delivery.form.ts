import { AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountAutocompleteItem, AdminDeliverySaveData, DateTimeRange, Delivery } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';
import { DateTimeRangeForm } from '~web/date-time/forms/date-time-range.form';

export class AdminDeliveryForm extends TypedFormGroup<AdminDeliveryFormT> {

  constructor(
    destroy$: Observable<any>,
    delivery?: Delivery
  ) {
    super({
      volunteerAccount: <AccountAutocompleteItem> delivery?.volunteerAccount,
      pickupWindow: new DateTimeRangeForm({
        startDateTime: [delivery?.pickupWindowStart, Validators.required],
        endDateTime: [delivery?.pickupWindowEnd, Validators.required]
      }),
      startTime: delivery?.startTime,
      pickupTime: delivery?.pickupTime,
      dropOffTime: delivery?.dropOffTime
    });
    this._listenForVolunteerAccountChange(destroy$);
    this._listenForStartTimeChange(destroy$);
    this._listenForPickupTimeChange(destroy$);
  }

  get volunteerAccount(): AccountAutocompleteItem {
    return this.enabled ? this.value.volunteerAccount : null;
  }

  get pickupWindow(): DateTimeRange {
    return this.enabled ? this.value.pickupWindow : null;
  }

  get startTime(): Date {
    return this.enabled ? this.value.startTime : null;
  }

  get pickupTime(): Date {
    return this.enabled ? this.value.pickupTime : null;
  }

  get dropOffTime(): Date {
    return this.enabled ? this.value.dropOffTime : null;
  }

  private _listenForVolunteerAccountChange(destroy$: Observable<any>): void {
    this.onValueChanges('volunteerAccount', destroy$).subscribe(
      () => this._onVolunteerAccountChange()
    );
    this._onVolunteerAccountChange();
  }

  private _onVolunteerAccountChange(): void {
    for (let controlName in this.controls) {
      if (controlName !== 'volunteerAccount') {
        const control: AbstractControl = this.controls[controlName];
        (this.volunteerAccount)
          ? control.enable()
          : control.disable();
      }
    }
    setTimeout(() => this._onStartTimeChange()); // Prevent ValueChangedAfterCheckedError.
  }

  private _listenForStartTimeChange(destroy$: Observable<any>): void {
    this.onValueChanges('startTime', destroy$).subscribe(
      () => this._onStartTimeChange()
    );
    this._onStartTimeChange();
  }

  private _onStartTimeChange(): void {
    (this.get('startTime').value && this.get('startTime').enabled)
      ? this.get('pickupTime').enable()
      : this.get('pickupTime').disable();
    this._onPickupTimeChange();
  }

  private _listenForPickupTimeChange(destroy$: Observable<any>): void {
    this.onValueChanges('pickupTime', destroy$).subscribe(
      () => this._onPickupTimeChange()
    );
    this._onPickupTimeChange();
  }

  private _onPickupTimeChange(): void {
    (this.get('pickupTime').value && this.get('pickupTime').enabled)
      ? this.get('dropOffTime').enable()
      : this.get('dropOffTime').disable();
  }

  /**
   * Converts the form's value to a partial delivery object.
   */
  toDeliverySaveData(): AdminDeliverySaveData {
    return (this.enabled && this.volunteerAccount)
      ? {
        pickupWindowStart: this.pickupWindow.startDateTime,
        pickupWindowEnd: this.pickupWindow.endDateTime,
        startTime: this.startTime,
        pickupTime: this.pickupTime,
        dropOffTime: this.dropOffTime
      }
      : null;
  }

  /**
   * Patches this form's value based on a given delivery.
   * @param delivery The delivery used for the patch.
   */
  patchFromDelivery(delivery: Delivery): void {
    this.patchValue(delivery);
    this.get('pickupWindow').patchValue({
      startDateTime: delivery?.pickupWindowStart,
      endDateTime: delivery?.pickupWindowEnd
    });
  }

  /**
   * Resets the value of the donation form and marks all fields as untouched/pristine.
   * Sets all direct child form fields to null except for 'volunteerAccount'.
   * @override
   */
  reset(): void {
    const volunteerAccount: AccountAutocompleteItem = this.volunteerAccount;
    super.reset({ volunteerAccount });
  }

  /**
   * @override
   */
  enable(): void {
    super.enable();
    // Recalculate the enabled state of all form members other than volunteerAccount based on the presence of a volunteerAccount value.
    this._onVolunteerAccountChange();
  }
}

export interface AdminDeliveryFormT {
  volunteerAccount: AccountAutocompleteItem;
  pickupWindow: DateTimeRange;
  startTime: Date;
  pickupTime: Date;
  dropOffTime: Date;
}
