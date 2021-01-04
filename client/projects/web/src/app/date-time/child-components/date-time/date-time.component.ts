import { Component, forwardRef } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService, formProvider } from '~web/forms';
import { DateTimeBaseComponent } from './date-time.base.component';

@Component({
  selector: 'foodweb-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    formProvider(DateTimeComponent),
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateTimeComponent), multi: true }
  ]
})
export class DateTimeComponent extends DateTimeBaseComponent {

  constructor(
    formHelperService: FormHelperService,
    dateTimeService: DateTimeService
  ) {
    super(formHelperService, dateTimeService);
  }
}
