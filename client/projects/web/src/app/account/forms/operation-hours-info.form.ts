import { TypedFormGroup } from '~web/typed-form-group';
import { OperationHours } from '~shared';

import { OperationHoursInfo } from '~web/account.form';
import { OperationHoursArray } from '~web/operation-hours.array';

export class OperationHoursInfoForm extends TypedFormGroup<OperationHoursInfo> {

  constructor(value?: OperationHours[]) {
    super({
      limitOperationHours: false,
      operationHours: new OperationHoursArray(value)
    });
  }

  patchValue(value: Partial<OperationHoursInfo | OperationHours[]>): void {
    const opHoursInfo: Partial<OperationHoursInfo> = this._operationHoursToInfo(value);
    this._fillLimitOperationHours(opHoursInfo);
    super.patchValue(opHoursInfo);
  }

  setValue(value: Partial<OperationHoursInfo | OperationHours[]>): void {
    const opHoursInfo: Partial<OperationHoursInfo> = this._operationHoursToInfo(value);
    this._fillLimitOperationHours(opHoursInfo);
    super.setValue(opHoursInfo);
  }

  private _operationHoursToInfo(value: Partial<OperationHoursInfo | OperationHours[]>): Partial<OperationHoursInfo> {
    return (value instanceof Array)
      ? { operationHours: value }
      : value;
  }

  private _fillLimitOperationHours(value: Partial<OperationHoursInfo>): void {
    if (value && value.operationHours.length > 0 && value.limitOperationHours == null) {
      this.get('limitOperationHours').setValue(true);
    }
  }

  toOperationHours(): OperationHours[] {
    return (this.get('limitOperationHours').value)
      ? this.get('operationHours').value.filter((opHours: OperationHours) => opHours.startTime || opHours.endTime)
      : [];
  }
}
