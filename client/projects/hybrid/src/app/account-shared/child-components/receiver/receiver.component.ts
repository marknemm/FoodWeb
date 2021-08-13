import { Component } from '@angular/core';
import { ReceiverComponent as WebReceiverComponent } from '~web/account-shared/child-components/receiver/receiver.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss'],
  providers: formProvider(ReceiverComponent)
})
export class ReceiverComponent extends WebReceiverComponent {}
