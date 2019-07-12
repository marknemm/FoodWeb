import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeService } from '../../services/date-time/date-time.service';

@Pipe({
  name: 'foodWebFormatTime'
})
export class FormatTimePipe implements PipeTransform {

  constructor(
    private _dateTimeService: DateTimeService
  ) {}

  transform(value: Date | string): string {
    if (value) {
      return this._dateTimeService.formatTime(value);
    }
    return '';
  }

}
