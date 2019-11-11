import { Observable, of } from 'rxjs';
import { TypedFormArray } from '~web/data-structure';
import { ConfirmDialogService } from '~web/shared';
import { OperationHours, Weekday, Constants } from '~shared';

import { OperationHoursForm } from '~web/account/forms/operation-hours.form';

export class OperationHoursArray extends TypedFormArray<OperationHours> {

  controls: OperationHoursForm[];

  private _constants = new Constants();

  constructor(value?: OperationHours[]) {
    super([], () => new OperationHoursForm());
    (value && value.length > 0)
      ? this.patchValue(value)
      : this.fillEmptyWeekdays();
  }

  patchValue(value: OperationHours[], options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    (!value || value.length === 0)
      ? this.fillEmptyWeekdays()
      : super.patchValue(value, options);
  }

  setValue(value: OperationHours[], options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    (!value || value.length === 0)
      ? this.fillEmptyWeekdays()
      : super.setValue(value, options);
  }

  fillEmptyWeekdays(): void {
    this.reset();
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
