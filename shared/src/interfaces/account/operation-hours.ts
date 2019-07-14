export type Weekday = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export interface OperationHours {
  id?: number;
  weekday: Weekday;
  startTime: string;
  endTime: string;
}
