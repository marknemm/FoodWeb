import { TFormGroup } from '~web/data-structure/t-form-group';

export class EventIdentifierForm extends TFormGroup<{ eventIdentifierStr: string }> {

  constructor(eventIdentifierStr = '') {
    super({ eventIdentifierStr });
  }
}
