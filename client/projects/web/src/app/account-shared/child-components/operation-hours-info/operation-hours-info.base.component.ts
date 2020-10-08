import { Component, Input } from '@angular/core';
import { OperationHoursInfo } from '~web/account-shared/forms/account.form';
import { OperationHoursInfoForm } from '~web/account-shared/forms/operation-hours-info.form';
import { FormBaseComponent } from '~web/data-structure/form-base-component';
import { TFormControl } from '~web/data-structure/t-form-control';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({ template: '' })
export class OperationHoursInfoBaseComponent extends FormBaseComponent<OperationHoursInfoForm> {

  @Input() editable = false;

  protected _operationHoursInfoDisplay: Partial<OperationHoursInfo> = {};
  protected _readonlyColSplitIdx: number;

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(new OperationHoursInfoForm(), formHelperService);
  }

  /**
   * Whether or not the operation hours have been set to limited.
   * If set to limited, then the user is shown weekay options for limiting their times of operation/availability.
   */
  get operationHoursLimited(): boolean {
    const limitedOpHoursCtrl = <TFormControl<boolean>>this.formGroup.get('limitOperationHours');
    return (limitedOpHoursCtrl ? limitedOpHoursCtrl.value : false);
  }

  /**
   * The display-only value for the operation hours.
   */
  get operationHoursInfoDisplay(): Partial<OperationHoursInfo> {
    return this._operationHoursInfoDisplay;
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
