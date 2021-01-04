import { Component } from '@angular/core';
import { ReceiverBaseComponent } from '~web/account-shared/child-components/receiver/receiver.base.component';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-receiver',
  templateUrl: './app-receiver.component.html',
  styleUrls: ['./app-receiver.component.scss'],
  providers: formProvider(AppReceiverComponent)
})
export class AppReceiverComponent extends ReceiverBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
