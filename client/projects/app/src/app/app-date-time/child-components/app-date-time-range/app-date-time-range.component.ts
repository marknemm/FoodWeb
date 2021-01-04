import { Component, Input, OnInit } from '@angular/core';
import { DateTimeRangeBaseComponent } from '~web/date-time/child-components/date-time-range/date-time-range.base.component';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-date-time-range',
  templateUrl: './app-date-time-range.component.html',
  styleUrls: ['./app-date-time-range.component.scss'],
  providers: formProvider(AppDateTimeRangeComponent)
})
export class AppDateTimeRangeComponent extends DateTimeRangeBaseComponent implements OnInit {

  @Input() endDateLabel = '';
  @Input() endDateTimeLabel = '';
  @Input() endTimeLabel = '';
  @Input() primaryLabel = '';
  @Input() startDateLabel = '';
  @Input() startDateTimeLabel = '';
  @Input() startTimeLabel = '';

  @Input() set endDateHint(hint: string) { this.endDatePlaceholder = hint; }
           get endDateHint(): string     { return this.endDatePlaceholder; }

  @Input() set endTimeHint(hint: string) { this.endTimePlaceholder = hint; }
           get endTimeHint(): string     { return this.endTimePlaceholder; }

  @Input() set startDateHint(hint: string) { this.startDatePlaceholder = hint; }
           get startDateHint(): string     { return this.startDatePlaceholder; }

  @Input() set startTimeHint(hint: string) { this.startTimePlaceholder = hint; }
           get startTimeHint(): string     { return this.startTimePlaceholder; }

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  get endDateTimeRow(): number {
    return (this.primaryLabel ? 2 : 1);
  }

  get rowsSchema(): string {
    return (this.primaryLabel ? 'auto,auto,auto' : 'auto,auto');
  }

  get startDateTimeRow(): number {
    return (this.primaryLabel ? 1 : 0);
  }

  ngOnInit() {}
}
