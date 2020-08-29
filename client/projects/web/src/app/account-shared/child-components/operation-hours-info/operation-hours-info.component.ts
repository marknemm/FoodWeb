import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OperationHours, Weekday } from '~shared';
import { OperationHoursInfoForm } from '~web/account/forms/operation-hours-info.form';
import { OperationHoursArray } from '~web/account/forms/operation-hours.array';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { ConfirmDialogService } from '~web/shared/services/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'foodweb-operation-hours-info',
  templateUrl: './operation-hours-info.component.html',
  styleUrls: ['./operation-hours-info.component.scss']
})
export class OperationHoursInfoComponent implements OnChanges {

  @Input() editing = false;
  @Input() operationHoursArr: OperationHours[] = [];
  @Input() formGroup: OperationHoursInfoForm;

  private _containsWed = false;

  constructor(
    public confirmDialogService: ConfirmDialogService
  ) {}

  /**
   * Whether or not the set operationHoursArr contains Wednesday.
   * Used in the template to determine uniform table cell size of weekday cells in operation hours display.
   */
  get containsWed(): boolean {
    return this._containsWed;
  }

  /**
   * Form array that contains the status of updates to the operation hours data.
   */
  get operationHoursFormArr(): OperationHoursArray {
    return <OperationHoursArray>this.formGroup.get('operationHours');
  }

  /**
   * Whether or not the operation hours have been set to limited.
   * If set to limited, then the user is shown weekay options for limiting their times of operation/availability.
   */
  get operationHoursLimited(): boolean {
    const limitedOpHoursCtrl = <TypedFormControl<boolean>>this.formGroup.get('limitOperationHours');
    return limitedOpHoursCtrl ? limitedOpHoursCtrl.value : false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formGroup = this.formGroup ? this.formGroup : new OperationHoursInfoForm();
    if (changes.operationHoursArr && this.operationHoursArr && this.operationHoursArr.length > 0) {
      this._handleOperationHoursArrUpdate();
    }
  }

  /**
   * Handles the update of the operationHoursArr input binding.
   */
  private _handleOperationHoursArrUpdate() {
    this.formGroup.patchValue(this.operationHoursArr);
    this._containsWed = !!this.operationHoursArr.find(
      (operationHours: OperationHours) => (operationHours.weekday === Weekday.Wednesday)
    );
  }

  /**
   * Gets the column split index for a given array. This represents where to split entries
   * within an array for a 2-column display.
   * @param arr The array to get the column split index for.
   * @param minPerCol The optional minimum number of entries per column.
   * @return The column split index.
   */
  getColSplitIdx(arr: any[], minPerCol = 0): number {
    return Math.max(Math.ceil(arr.length / 2), minPerCol);
  }
}
