import { TFormGroup } from '~web/forms';

export class EventIdentifierForm extends TFormGroup<{ eventIdentifierStr: string }> {

  constructor(eventIdentifierStr = '') {
    super({ eventIdentifierStr });
  }
}
