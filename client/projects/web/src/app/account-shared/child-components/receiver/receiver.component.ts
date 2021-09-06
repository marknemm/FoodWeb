import { Component } from '@angular/core';
import { ReceiverForm } from '~web/account-shared/forms/receiver.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss'],
  providers: formProvider(ReceiverComponent)
})
export class ReceiverComponent extends FormBaseComponent<ReceiverForm> {

  constructor(formHelperService: FormHelperService) {
    super(() => new ReceiverForm(), formHelperService);
  }

}
