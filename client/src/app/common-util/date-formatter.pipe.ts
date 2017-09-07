import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatter } from '../../../../shared/common-util/date-formatter';


@Pipe({
    name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {

    public transform(value: Date, args?: any): string {
        return DateFormatter.dateToMonthDayYearString(value);
    }
}
