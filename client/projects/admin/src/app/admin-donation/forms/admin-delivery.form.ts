import { Account, Delivery } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class AdminDeliveryForm extends TypedFormGroup<AdminDeliveryFormT> {

  constructor(delivery?: Delivery) {
    super({
      volunteerAccount: delivery?.volunteerAccount,
      pickupWindowStart: delivery?.pickupWindowStart,
      pickupWindowEnd: delivery?.pickupWindowEnd,
      startTime: delivery?.startTime,
      pickupTime: delivery?.pickupTime,
      dropOffTime: delivery?.dropOffTime
    });
  }

  get volunteerAccount(): Account {
    return this.get('volunteerAccount').value;
  }
}

export interface AdminDeliveryFormT {
  volunteerAccount: Account;
  pickupWindowStart: Date;
  pickupWindowEnd: Date;
  startTime: Date;
  pickupTime: Date;
  dropOffTime: Date;
}
