import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
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
