import { OperationHours } from '..//interfaces/account/operation-hours';
import { Constants } from '../constants/constants';
export { OperationHours };

export class OperationHoursHelper {

  readonly _constants = new Constants();

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
}
