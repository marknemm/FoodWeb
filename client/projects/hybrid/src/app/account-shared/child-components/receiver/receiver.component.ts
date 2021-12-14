import { Component } from '@angular/core';
import { ReceiverComponent as WebReceiverComponent } from '~web/account-shared/child-components/receiver/receiver.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss'],
  providers: [FormFieldService]
})
export class ReceiverComponent extends WebReceiverComponent {}
