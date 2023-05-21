import { FormGroup, Validators } from '@angular/forms';
import { Account, DateTimeRange } from '~shared';
import { Controls, toControls } from '~web/forms';

export class AdminScheduleDeliveryForm extends FormGroup<DeliveryControls> {
  constructor() {
    super(toControls({
      volunteerAccount: [null as Account, Validators.required],
      pickupWindow: [null as DateTimeRange, Validators.required]
    }));
  }

  get volunteerAccount(): Account {
    return this.get('volunteerAccount').getRawValue();
  }

  get pickupWindow(): DateTimeRange {
    return this.get('pickupWindow').getRawValue();
  }
}

export type DeliveryControls = Controls<DeliveryFormData>;
export interface DeliveryFormData {
  volunteerAccount: Account;
  pickupWindow: DateTimeRange;
}
