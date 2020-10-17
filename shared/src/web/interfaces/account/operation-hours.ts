/**
 * A string enum of (titlecase) weekdays.
 */
export enum Weekday {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}

/**
 * Represents weekday operation hours for a business or volunteer.
 */
export interface OperationHours {
  /**
   * The auto-generated integer ID of the operation hours.
   */
  id?: number;
  /**
   * The weekday string.
   */
  weekday: Weekday;
  /**
   * The start time of operation for the day.
   */
  startTime: string;
  /**
   * The end time of operation for the day.
   */
  endTime: string;
}
