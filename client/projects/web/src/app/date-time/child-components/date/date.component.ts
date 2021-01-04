import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import { DateBaseComponent } from './date.base.component';

@Component({
  selector: 'foodweb-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: formProvider(DateComponent)
})
export class DateComponent extends DateBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
