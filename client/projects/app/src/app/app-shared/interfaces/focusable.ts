import { EventEmitter } from '@angular/core';

export interface FocusableComponent extends Focusable {
  enabled?: BooleanInput;
  editable?: BooleanInput;
  visible?: VisibleInput;
  nextFocus: Focusable;

  blur?: EventEmitter<void>;
  focusOutput: EventEmitter<void>;
}

export interface Focusable {
  /**
   * Transfers focus to this native element or component.
   * @return Whether or not the element has been focused.
   */
  focus(): boolean;
}
