import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import { ReceiverBaseComponent } from './receiver.base.component';

@Component({
  selector: 'foodweb-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss'],
  providers: formProvider(ReceiverComponent)
})
export class ReceiverComponent extends ReceiverBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
