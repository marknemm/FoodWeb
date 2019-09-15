import { TypedFormGroup } from '../../data-structure/typed-form-group';
import { DateTimeService } from '../../date-time/services/date-time/date-time.service';
import { OperationHours } from '../../../../../shared/src/interfaces/account/operation-hours';

export class OperationHoursForm extends TypedFormGroup<OperationHours> {

  constructor(dateTimeService: DateTimeService, operationHours: Partial<OperationHours> = {}) {
    super({
      id: undefined,
      weekday: null,
      startTime: '',
      endTime: ''
    },
    {
      validators: [
        dateTimeService.genTimeRangeOrderValidator('startTime', 'endTime'),
        dateTimeService.allOrNothingOpHoursValidator
      ]
    });
    this.patchValue(operationHours);
  }
}
