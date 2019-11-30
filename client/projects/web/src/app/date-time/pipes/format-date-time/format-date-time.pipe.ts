import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeService } from '~web/date-time/date-time/date-time.service';

@Pipe({
  name: 'foodWebFormatDateTime'
})
export class FormatDateTimePipe implements PipeTransform {

  constructor(
    private _dateTimeService: DateTimeService
  ) {}

  transform(value: Date | string): string {
    if (value) {
      return this._dateTimeService.formatDateTime(value);
    }
    return '';
  }

}
