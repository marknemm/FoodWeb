import { OperationHoursEntity } from './../entity/operation-hours.entity';
import { OperationHours } from '../../../shared/src/interfaces/account/operation-hours';
import { Constants } from '../../../shared/src/constants/constants';
export { OperationHoursEntity };

const _constants = new Constants();

/**
 * Sorts a given operation hours array.
 * @param operationHoursArr The operation hours array to sort.
 * @return The sorted (copy) of the operation hours array.
 */
export function sortOperationHours(operationHoursArr: OperationHours[]): OperationHours[] {
  return operationHoursArr.sort((lhs: OperationHours, rhs: OperationHours) => {
    const rhsWeekdayIdx: number = _constants.WEEKDAYS.indexOf(rhs.weekday);
    const lhsWeekdayIdx: number = _constants.WEEKDAYS.indexOf(lhs.weekday);
    const dayMsDiff: number = (lhsWeekdayIdx - rhsWeekdayIdx) * 24 * 60 * 60 * 1000;

    const rhsTimeMs: number = new Date(`1/1/2000 ${rhs.startTime}`).getTime();
    const lhsTimeMs: number = new Date(`1/1/2000 ${lhs.startTime}`).getTime();
    const timeMsDiff: number = (lhsTimeMs - rhsTimeMs);

    return (dayMsDiff + timeMsDiff);
  });
}

/**
 * Formats the operation hours times to be in "wall-clock time format" (hh:mm [am|pm]).
 * Internally modifies the startTime & endTime mbmers of the given operationHours argument.
 * @param operationHours Operation hours container that will have its members formatted.
 */
export function formatOperationHoursTimes(operationHoursArr: OperationHoursEntity[]): void {
  operationHoursArr.forEach((operationHours: OperationHoursEntity) => {
    operationHours.startTime = _formatOperationHourTime(operationHours.startTime);
    operationHours.endTime = _formatOperationHourTime(operationHours.endTime);
  });
}

function _formatOperationHourTime(time: string): string {
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
