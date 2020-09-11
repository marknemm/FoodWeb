import { Component } from '@angular/core';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { DateBaseComponent } from './date.base.component';

@Component({
  selector: 'foodweb-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: valueAccessorProvider(DateComponent)
})
export class DateComponent extends DateBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
