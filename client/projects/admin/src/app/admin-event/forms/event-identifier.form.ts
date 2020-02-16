import { TypedFormGroup } from '~web/data-structure/typed-form-group';

export class EventIdentifierForm extends TypedFormGroup<{ eventIdentifierStr: string }> {

  constructor(eventIdentifierStr = '') {
    super({ eventIdentifierStr });
  }
}
