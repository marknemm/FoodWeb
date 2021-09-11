import { TimeRange } from '~shared';
import { FlexFormArray } from '~web/forms/classes/flex-form-array';
import { TimeRangeForm } from './time-range.form';

export class TimeRangeArray extends FlexFormArray<TimeRangeForm> {

  constructor(value?: TimeRange[]) {
    super(value, () => new TimeRangeForm());
  }

}
