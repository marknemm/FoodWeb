import { OperationHours, Weekday } from '~shared';
import { OperationHoursFormT } from '~web/account-shared/forms/account.form';
import { TimeRangeArray } from '~web/date-time/forms/time-range.array';
import { TFormGroup } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

export class OperationHoursForm extends TFormGroup<OperationHoursFormT> {

  private _constantsService = new ConstantsService();

  private _timeRangeCount = 0;
  private _weekdayCount = 0;

  constructor(value: OperationHours[] = []) {
    super({
      limitOperationHours: false,
      Sunday: new TimeRangeArray([]),
      Monday: new TimeRangeArray([]),
      Tuesday: new TimeRangeArray([]),
      Wednesday: new TimeRangeArray([]),
      Thursday: new TimeRangeArray([]),
      Friday: new TimeRangeArray([]),
      Saturday: new TimeRangeArray([])
    });
    if (value) {
      this.patchValue(value);
    }
    this._updateTimeRangeCountOnChange();
  }

  get operationHoursLimited(): boolean {
    return this.get('limitOperationHours').value;
  }

  get timeRangeCount(): number {
    return this._timeRangeCount;
  }

  get weekdayCount(): number {
    return this._weekdayCount;
  }

  patchValue(value: Partial<OperationHoursFormT | OperationHours[]>): void {
    const opHoursInfo: Partial<OperationHoursFormT> = this._operationHoursToInfo(value);
    this._fillLimitOperationHours(opHoursInfo);
    super.patchValue(opHoursInfo);
  }

  setValue(value: OperationHoursFormT | OperationHours[]): void {
    const opHoursInfo: OperationHoursFormT = this._operationHoursToInfo(value) as OperationHoursFormT;
    this._fillLimitOperationHours(opHoursInfo);
    super.setValue(opHoursInfo);
  }

  doesWeekdayHaveHours(weekday: Weekday): boolean {
    const weekdayArr = <TimeRangeArray>this.get(weekday);
    const firstTimeRange = weekdayArr?.at(0)?.value;
    return !!(firstTimeRange?.startTime && firstTimeRange?.endTime);
  }

  private _updateTimeRangeCountOnChange(): void {
    this.valueChanges.subscribe(() => {
      this._timeRangeCount = 0;
      this._weekdayCount = 0;
      for (const weekday of this._constantsService.WEEKDAYS) {
        if (this.doesWeekdayHaveHours(weekday)) {
          this._timeRangeCount += this.get(weekday).value.length;
          this._weekdayCount++;
        }
      }
    });
  }

  private _operationHoursToInfo(value: Partial<OperationHoursFormT | OperationHours[]>): Partial<OperationHoursFormT> {
    if (!(value as OperationHoursFormT)?.limitOperationHours) {
      const opHoursInfo: Partial<OperationHoursFormT> = {
        limitOperationHours: false,
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
      };

      if (value instanceof Array) {
        for (const opHours of value) {
          opHoursInfo[opHours.weekday].push(opHours);
        }
        opHoursInfo.limitOperationHours = (value.length > 0);
      }

      return opHoursInfo;
    }
    return <OperationHoursFormT>value;
  }

  private _fillLimitOperationHours(value: Partial<OperationHoursFormT>): void {
    if (value && value.limitOperationHours == null) {
      this.get('limitOperationHours').setValue(
        this._hasOperationHours(value)
      );
    }
  }

  private _hasOperationHours(value: Partial<OperationHoursFormT>): boolean {
    return !!(value.Sunday.length || value.Monday.length || value.Tuesday.length || value.Wednesday.length
        || value.Thursday.length || value.Friday.length || value.Saturday.length);
  }

  toOperationHours(): OperationHours[] {
    const opHoursArr: OperationHours[] = [];
    if (this.get('limitOperationHours').value) {
      for (const weekday of this._constantsService.WEEKDAYS) {
        for (const timeRange of this.get(weekday).value) {
          if (timeRange.startTime && timeRange.endTime) {
            opHoursArr.push({
              weekday,
              startTime: timeRange.startTime,
              endTime: timeRange.endTime
            });
          }
        }
      }
    }
    return opHoursArr;
  }
}
