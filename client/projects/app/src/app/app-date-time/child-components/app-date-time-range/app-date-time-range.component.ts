import { Component, OnInit } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { DateTimeRangeBaseComponent } from '~web/date-time/child-components/date-time-range/date-time-range.base.component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

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
