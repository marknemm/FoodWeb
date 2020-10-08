import { Component } from '@angular/core';
import { ReceiverBaseComponent } from '~web/account-shared/child-components/receiver/receiver.base.component';
import { formProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

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
