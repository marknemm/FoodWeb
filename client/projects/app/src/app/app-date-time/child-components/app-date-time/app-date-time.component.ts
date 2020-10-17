import { Component, forwardRef } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { formProvider } from '~web/data-structure/form-base-component';
import { DateTimeBaseComponent } from '~web/date-time/child-components/date-time/date-time.base.component';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

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
