import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';

@Pipe({
  name: 'foodwebFormatDateTime'
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
