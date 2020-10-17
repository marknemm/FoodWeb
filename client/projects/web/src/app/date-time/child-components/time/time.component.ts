import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { TimeBaseComponent } from './time.base.component';

@Component({
  selector: 'foodweb-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: formProvider(TimeComponent)
})
export class TimeComponent extends TimeBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
