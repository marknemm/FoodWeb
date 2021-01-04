import { EventEmitter } from '@angular/core';

export interface FocusableComponent extends Focusable {
  /**
   * Whether or not the component is currently focusable.
   */
  focusable: boolean;
  /**
   * The focusable component/element that comes after this one.
   */
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
