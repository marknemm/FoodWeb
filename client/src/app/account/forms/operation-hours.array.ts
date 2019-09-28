import { Observable, of } from 'rxjs';
import { OperationHoursForm } from './operation-hours.form';
import { TypedFormArray } from '../../data-structure/typed-form-array';
import { ConfirmDialogService } from '../../shared/services/confirm-dialog/confirm-dialog.service';
import { OperationHours, Weekday } from '../../../../../shared/src/interfaces/account/operation-hours';
import { Constants } from '../../../../../shared/src/constants/constants';

export class OperationHoursArray extends TypedFormArray<OperationHours> {

  controls: OperationHoursForm[];

  private _constants = new Constants();

  constructor(config: OperationHoursArrayConfig = {}) {
    super([], () => new OperationHoursForm());
    if (config.value) {
      this.patchValue(config.value);
    }
    if (config.initEmptyWeekdays) {
      this._initEmptyWeekdays();
    }
  }

  private _initEmptyWeekdays(): void {
    this._constants.WEEKDAYS.forEach((weekday: Weekday) => this.push({ weekday, startTime: '', endTime: '' }));
  }

  addBlankEntry(): void {
    this.push({ weekday: <any>'', startTime: '', endTime: '' });
  }

  removeOperationHours(idx: number, confirmDialogService?: ConfirmDialogService): void {
    this._getDeleteConfirmation(idx, confirmDialogService).subscribe(
      (confirm: boolean) => {
        if (confirm) {
          this.removeAt(idx);
        }
      }
    );
  }

  private _getDeleteConfirmation(idx: number, confirmDialogService: ConfirmDialogService): Observable<boolean> {
    const confirmMsg = 'Are you sure you wish to delete the operation hours?';
    let deleteConfirmation$: Observable<boolean> = of(true);
    if (confirmDialogService && this.at(idx).value.startTime && this.at(idx).value.endTime) {
      deleteConfirmation$ = confirmDialogService.displayConfirmDialog(confirmMsg, 'Confirm Delete');
    }
    return deleteConfirmation$;
  }
}

export interface OperationHoursArrayConfig {
  value?: OperationHours[];
  initEmptyWeekdays?: boolean;
}
