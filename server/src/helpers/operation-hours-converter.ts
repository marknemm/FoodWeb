// import { Constants } from '../constants/constants';
// export { OperationHours };

// export interface Time {
//   hour: number;
//   minute: number;
// }

// export class OperationHoursConverter {
  
//   constructor() {}

//   operationHoursToString(operationHours: OperationHours): string {
//     const weekdayStr: string = Constants.WEEKDAYS[operationHours.weekday];
//     const startTimeStr: string = this.startTimeToString(operationHours);
//     const endTimeStr: string = this.endTimeToString(operationHours);
//     return `${weekdayStr}, ${startTimeStr} to ${endTimeStr}`;
//   }

//   startTimeToString(operationHours: OperationHours): string {
//     return this.timeToString(operationHours.startHour, operationHours.startMinute);
//   }

//   endTimeToString(operationHours: OperationHours): string {
//     return this.timeToString(operationHours.endHour, operationHours.endMinute);
//   }

//   timeToString(hour: number, minute: number): string {
//     const amPmStr: string = (hour > 11 ? 'pm' : 'am');
//     const hourStr: string = `${hour % 12}`;
//     const minuteStr: string = (minute > 9 ? `${minute}` : `0${minute}`);
//     return `${hourStr}:${minuteStr} ${amPmStr}`;
//   }

//   timeFromString(timeStr: string): Time {
//     const date = new Date(`1/1/2000 ${timeStr}`);
//     return {
//       hour: date.getHours(),
//       minute: date.getMinutes()
//     };
//   }
// }
