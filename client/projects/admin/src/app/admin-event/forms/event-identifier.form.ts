import { FormControl, FormGroup } from '@angular/forms';

export class EventIdentifierForm extends FormGroup<{ eventIdentifierStr: FormControl<string> }> {

  constructor(eventIdentifierStr = '') {
    super({ eventIdentifierStr: new FormControl(eventIdentifierStr) });
  }
}
