import { DateTimeHelper } from './date-time-helper'
import { Constants } from '../constants/constants';
import { DateTimeRange } from '../interfaces/misc/time';
import { OperationHours, Weekday } from '../interfaces/account/operation-hours';
export { OperationHours };

export class OperationHoursHelper {

  private readonly _dateTimeHelper = new DateTimeHelper()
  private readonly _constants = new Constants();

  /**
   * Sorts a given operation hours array.
   * @param operationHoursArr The operation hours array to sort.
   * @return The sorted (copy) of the operation hours array.
   */
  sortOperationHours(operationHoursArr: OperationHours[]): OperationHours[] {
    if (operationHoursArr) {
      operationHoursArr = operationHoursArr.sort((lhs: OperationHours, rhs: OperationHours) => {
        const rhsWeekdayIdx: number = this._constants.WEEKDAYS.indexOf(rhs.weekday);
        const lhsWeekdayIdx: number = this._constants.WEEKDAYS.indexOf(lhs.weekday);
        const dayMsDiff: number = (lhsWeekdayIdx - rhsWeekdayIdx) * 24 * 60 * 60 * 1000;

        const rhsTimeMs: number = new Date(`1/1/2000 ${rhs.startTime}`).getTime();
        const lhsTimeMs: number = new Date(`1/1/2000 ${lhs.startTime}`).getTime();
        const timeMsDiff: number = (lhsTimeMs - rhsTimeMs);

        return (dayMsDiff + timeMsDiff);
      });
    }
    return operationHoursArr;
  }

  /**
   * Formats the operation hours times to be in "wall-clock time format" (hh:mm [am|pm]).
   * Internally modifies the startTime & endTime members of the given operationHours argument.
   * @param operationHours Operation hours container that will have its members formatted.
   */
  formatOperationHoursTimes(operationHoursArr: OperationHours[]): void {
    if (operationHoursArr) {
      operationHoursArr.forEach((operationHours: OperationHours) => {
        operationHours.startTime = this._formatOperationHourTime(operationHours.startTime);
        operationHours.endTime = this._formatOperationHourTime(operationHours.endTime);
      });
    }
  }

  private _formatOperationHourTime(time: string): string {
    const date = new Date(`1/1/2000 ${time}`);
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();

    const amPmStr: string = (hours > 11 ? 'pm' : 'am');
    const hourStr = (hours > 12) ?
      `${hours - 12}` :
      `${hours !== 0 ? hours : 12}`;
    const minuteStr: string = (minutes > 9 ? `${minutes}` : `0${minutes}`);

    return `${hourStr}:${minuteStr} ${amPmStr}`;
  }

  /**
   * Converts a date-time range to operation hours.
   * @param dateTimeRange The date-time range.
   * @param timezone The optional timezone of the operation hours output. Defaults to 'UTC'.
   * @return The operation hours.
   */
  dateTimeRangeToOperationHours(dateTimeRange: DateTimeRange, timezone = 'UTC'): OperationHours {
    // TODO: If dateTimeRange spans multiple days, then generate operation hours for each of those days.
    const operationHours: OperationHours = {
      weekday: <Weekday>this._dateTimeHelper.toLocalWeekdayStr(dateTimeRange.startDateTime, timezone),
      startTime: this._dateTimeHelper.toLocalTimeStr(dateTimeRange.startDateTime, timezone),
      endTime: this._dateTimeHelper.toLocalTimeStr(dateTimeRange.endDateTime, timezone)
    }
    return operationHours;
  }
}
