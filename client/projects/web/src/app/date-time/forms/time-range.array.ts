import { TimeRange } from '~shared';
import { TFormArray } from '~web/forms';
import { TimeRangeForm } from './time-range.form';

export class TimeRangeArray extends TFormArray<TimeRangeForm> {

  constructor(value?: TimeRange[]) {
    super([], () => new TimeRangeForm());
    if (value && value.length > 0) {
      this.patchValue(value);
    }
    if (this.length === 0) {
      this.push(); // Add a single empty element to accept user input.
    }
  }

  // remove(operationHoursForm: OperationHoursForm, confirmDialog?: ConfirmDialog): void {
  //   const idx: number = this.controls.indexOf(operationHoursForm);
  //   if (idx >= 0) {
  //     this._getDeleteConfirmation(idx, confirmDialog).subscribe(
  //       (confirm: boolean) => {
  //         if (confirm) {
  //           this.removeAt(idx);
  //         }
  //       }
  //     );
  //   }
  // }

  // private _getDeleteConfirmation(idx: number, confirmDialog: ConfirmDialog): Observable<boolean> {
  //   const confirmMsg = 'Are you sure you wish to delete the operation hours?';
  //   let deleteConfirmation$: Observable<boolean> = of(true);
  //   if (confirmDialog && this.at(idx).value.startTime && this.at(idx).value.endTime) {
  //     deleteConfirmation$ = confirmDialog.displayConfirmDialog(confirmMsg, 'Confirm Delete');
  //   }
  //   return deleteConfirmation$;
  // }
}
