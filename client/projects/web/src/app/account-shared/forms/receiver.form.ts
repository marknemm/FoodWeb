import { Receiver } from '~shared';
import { TFormGroup } from '~web/forms';

export class ReceiverForm extends TFormGroup<Receiver> {

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
