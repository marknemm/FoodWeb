import { Receiver } from '~shared';
import { TypedFormGroup } from '~web/data-structure/typed-form-group';

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
