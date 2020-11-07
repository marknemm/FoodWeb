import { Component, OnInit } from '@angular/core';
import { DateTimeRangeBaseComponent } from '~web/date-time/child-components/date-time-range/date-time-range.base.component';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-date-time-range',
  templateUrl: './app-date-time-range.component.html',
  styleUrls: ['./app-date-time-range.component.scss'],
  providers: formProvider(AppDateTimeRangeComponent)
})
export class AppDateTimeRangeComponent extends DateTimeRangeBaseComponent implements OnInit {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  ngOnInit() {}
}
