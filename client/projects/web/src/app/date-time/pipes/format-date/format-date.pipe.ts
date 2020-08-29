import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';

@Pipe({
  name: 'foodwebFormatDate'
})
export class FormatDatePipe implements PipeTransform {

  constructor(
    private _dateTimeService: DateTimeService
  ) {}

  transform(value: Date | string): string {
    if (value) {
      return this._dateTimeService.formatDate(value);
    }
    return '';
  }

}
