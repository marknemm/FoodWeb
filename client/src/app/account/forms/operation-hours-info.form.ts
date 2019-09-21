import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { OperationHoursInfo } from './account.form';
import { OperationHoursArrayConfig, OperationHoursArray } from './operation-hours.array';
import { OperationHours } from '../../../../../shared/src/interfaces/account/account';

export class OperationHoursInfoForm extends TypedFormGroup<OperationHoursInfo> {

  constructor(config?: OperationHoursArrayConfig) {
    super({
      limitOperationHours: false,
      operationHours: new OperationHoursArray(config)
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
}
