import { Component, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: formProvider(DateComponent)
})
export class DateComponent extends FormBaseComponent<Date> {

  @Input() allowClear = false;
  @Input() bold = false;
  @Input() calendarMode = false;
  @Input() dateFilter: DateFilterFn<Date>;
  @Input() defaultDate: Date;
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() label: string;
  @Input() labelPosition: 'fixed' | 'floating' | 'stacked' = 'fixed';
  @Input() maxDate: Date;
  @Input() minDate = new Date();
  @Input() minWidth = '';

  constructor(formHelperService: FormHelperService) {
    super(() => new TFormControl<Date>(), formHelperService);
  }

}
