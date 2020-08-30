import { Component } from '@angular/core';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { ReceiverBaseComponent } from './receiver.base.component';

@Component({
  selector: 'foodweb-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss'],
  providers: valueAccessorProvider(ReceiverComponent)
})
export class ReceiverComponent extends ReceiverBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
