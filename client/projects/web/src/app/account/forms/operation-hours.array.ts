import { Observable, of } from 'rxjs';
import { Constants, OperationHours, Weekday } from '~shared';
import { TypedFormArray } from '~web/data-structure/typed-form-array';
import { ConfirmDialog } from '~web/shared/interfaces/confirm-dialog';
import { OperationHoursForm } from './operation-hours.form';

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

  remove(operationHoursForm: OperationHoursForm, confirmDialog?: ConfirmDialog): void {
    const idx: number = this.controls.indexOf(operationHoursForm);
    if (idx >= 0) {
      this._getDeleteConfirmation(idx, confirmDialog).subscribe(
        (confirm: boolean) => {
          if (confirm) {
            this.removeAt(idx);
          }
        }
      );
    }
  }

  private _getDeleteConfirmation(idx: number, confirmDialog: ConfirmDialog): Observable<boolean> {
    const confirmMsg = 'Are you sure you wish to delete the operation hours?';
    let deleteConfirmation$: Observable<boolean> = of(true);
    if (confirmDialog && this.at(idx).value.startTime && this.at(idx).value.endTime) {
      deleteConfirmation$ = confirmDialog.displayConfirmDialog(confirmMsg, 'Confirm Delete');
    }
    return deleteConfirmation$;
  }
}
