export enum Weekday {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}

export interface OperationHours {
  id?: number;
  weekday: Weekday;
  startTime: string;
  endTime: string;
}
