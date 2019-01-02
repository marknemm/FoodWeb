import { OperationHoursEntity } from './../entity/operation-hours.entity';
export { OperationHoursEntity };

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
  const hourStr = `${hours % 12}`;
  const minuteStr: string = (minutes > 9 ? `${minutes}` : `0${minutes}`);

  return `${hourStr}:${minuteStr} ${amPmStr}`;
}
