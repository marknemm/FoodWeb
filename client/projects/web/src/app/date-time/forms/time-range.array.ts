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

  /**
   * Checks if the element at a given index may be removed.
   * @param idx The index to check.
   * @return true if it may be removed, false if not.
   */
  canRemoveAt(idx: number): boolean {
    return (idx < this.length && (this.length > 1 || !!this.at(idx).startTime || !!this.at(idx).endTime));
  }

  /**
   * @override
   * Removes an element in this form array at a given index.
   * Ensures that there is always at least one element remaining in the array for data entry.
   * @param idx The index of the item to remove.
   * @return The removed item.
   */
  removeAt(idx: number): TimeRangeForm {
    const removed: TimeRangeForm = super.removeAt(idx);
    if (this.length === 0) {
      this.push();
    }
    return removed;
  }
}
