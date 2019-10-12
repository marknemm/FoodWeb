import { TypedFormGroup } from '../../../app/data-structure/typed-form-group';
import { Receiver } from '../../../../../shared/src/interfaces/account/receiver';

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
