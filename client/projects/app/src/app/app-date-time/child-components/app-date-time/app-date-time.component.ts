import { Component, forwardRef } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { DateTimeBaseComponent } from '~web/date-time/child-components/date-time/date-time.base.component';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-date-time',
  templateUrl: './app-date-time.component.html',
  styleUrls: ['./app-date-time.component.scss'],
  providers: formProvider(AppDateTimeComponent).concat([
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => AppDateTimeComponent), multi: true }
  ])
})
export class AppDateTimeComponent extends DateTimeBaseComponent {

  constructor(
    formHelperService: FormHelperService,
    dateTimeService: DateTimeService,
  ) {
    super(formHelperService, dateTimeService);
  }
}
