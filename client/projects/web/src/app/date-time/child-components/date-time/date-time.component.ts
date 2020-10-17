import { Component, forwardRef } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { formProvider } from '~web/data-structure/form-base-component';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { DateTimeBaseComponent } from './date-time.base.component';

@Component({
  selector: 'foodweb-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: formProvider(DateTimeComponent).concat([
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTimeComponent), multi: true }
  ])
})
export class DateTimeComponent extends DateTimeBaseComponent {

  constructor(
    formHelperService: FormHelperService,
    dateTimeService: DateTimeService
  ) {
    super(formHelperService, dateTimeService);
  }
}
