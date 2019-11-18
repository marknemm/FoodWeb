import { TypedFormGroup } from '~web/typed-form-group';
import { Receiver } from '~shared';

export class ReceiverForm extends TypedFormGroup<Receiver> {

  constructor(receiver?: Partial<Receiver>) {
    super({
      id: undefined,
      autoReceiver: true
    });
    if (receiver) {
      this.patchValue(receiver);
    }
  }
}
