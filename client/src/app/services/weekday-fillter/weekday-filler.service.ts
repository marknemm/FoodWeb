import { Injectable } from '@angular/core';
import { ConstantsService } from '../constants/constants.service';
import { OperationHours } from '../../../../../shared/src/interfaces/account/account';
import { OperationHoursHelper } from '../../../../../shared/src/helpers/operation-hours-helper';

@Injectable({
  providedIn: 'root'
})
export class WeekdayFillerService {

  private readonly _weekdayIdxMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

  constructor(
    private _constantsService: ConstantsService,
    private _operationHoursHelper: OperationHoursHelper
  ) {}

  fillMissingWeekdays(operationHoursArr: OperationHours[]): OperationHours[] {
    if (operationHoursArr && operationHoursArr.length > 0) {
      operationHoursArr = operationHoursArr.slice(); // Copy so we don't modify input array unintentionally.
      // Filling missing weekdays depends on operation hours array being sorted!
      operationHoursArr = this._operationHoursHelper.sortOperationHours(operationHoursArr);
      operationHoursArr = this._fillMissingWeekdaysBetweenEntries(operationHoursArr);
      operationHoursArr = this._fillMissingWeekaysBeforeEntries(operationHoursArr);
      operationHoursArr = this._fillMissingWeekaysAfterEntries(operationHoursArr);
    } else {
      operationHoursArr = [this._genEmptyOpHoursForWeekdayIdx(0)];
      operationHoursArr = this._fillMissingWeekaysAfterEntries(operationHoursArr);
    }
    return operationHoursArr;
  }

  private _fillMissingWeekdaysBetweenEntries(operationHoursArr: OperationHours[]): OperationHours[] {
    for (let i = 0; i < operationHoursArr.length - 1; i++) {
      const curWeekdayIdx: number = this._weekdayIdxMap[operationHoursArr[i].weekday];
      const nextWeekdayIdx: number = this._weekdayIdxMap[operationHoursArr[i + 1].weekday];
      if (curWeekdayIdx !== nextWeekdayIdx - 1) {
        const fillOpHours = this._genEmptyOpHoursForWeekdayIdx(curWeekdayIdx + 1);
        operationHoursArr.splice(i + 1, 0, fillOpHours);
      }
    }
    return operationHoursArr;
  }

  private _fillMissingWeekaysBeforeEntries(operationHoursArr: OperationHours[]): OperationHours[] {
    while (this._weekdayIdxMap[operationHoursArr[0].weekday] > 0) {
      const firstWeekdayIdx: number = this._weekdayIdxMap[operationHoursArr[0].weekday];
      const newFirstOpHours: OperationHours = this._genEmptyOpHoursForWeekdayIdx(firstWeekdayIdx - 1);
      operationHoursArr.unshift(newFirstOpHours);
    }
    return operationHoursArr;
  }

  private _fillMissingWeekaysAfterEntries(operationHoursArr: OperationHours[]): OperationHours[] {
    while (this._weekdayIdxMap[operationHoursArr[operationHoursArr.length - 1].weekday] < 6) {
      const lastWeekdayIdx: number = this._weekdayIdxMap[operationHoursArr[operationHoursArr.length - 1].weekday];
      const newLastOpHours: OperationHours = this._genEmptyOpHoursForWeekdayIdx(lastWeekdayIdx + 1);
      operationHoursArr.push(newLastOpHours);
    }
    return operationHoursArr;
  }

  private _genEmptyOpHoursForWeekdayIdx(weekdayIdx: number): OperationHours {
    return {
      id: null,
      weekday: this._constantsService.WEEKDAYS[weekdayIdx],
      startTime: '',
      endTime: ''
    };
  }
}
