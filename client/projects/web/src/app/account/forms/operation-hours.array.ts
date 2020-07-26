import { Observable, of } from 'rxjs';
import { Constants, OperationHours, Weekday } from '~shared';
import { TypedFormArray } from '~web/data-structure/typed-form-array';
import { ConfirmDialogService } from '~web/shared/services/confirm-dialog/confirm-dialog.service';
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

  remove(operationHoursForm: OperationHoursForm, confirmDialogService?: ConfirmDialogService): void {
    const idx: number = this.controls.indexOf(operationHoursForm);
    if (idx >= 0) {
      this._getDeleteConfirmation(idx, confirmDialogService).subscribe(
        (confirm: boolean) => {
          if (confirm) {
            this.removeAt(idx);
          }
        }
      );
    }
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
