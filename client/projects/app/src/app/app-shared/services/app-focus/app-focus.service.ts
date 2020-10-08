import { Injectable } from '@angular/core';
import { Focusable, FocusableComponent } from '~app/app-shared/interfaces/focusable';
import _ from '~lodash-mixins';
export * from '~app/app-shared/interfaces/focusable';

/**
 * Handles transfer of focus between focusable components and/or focusable native elements.
 */
@Injectable({
  providedIn: 'root'
})
export class AppFocusService {

  constructor() {}

  /**
   * Applies focus to a given focusable component.
   * If the focusable component is not currently enabled, then attempts to forward focus to the configurated next focus element.
   * @param focusableComponent The focusable component.
   * @param focusTarget The component's internal focus target (can be a native element or another focusable component).
   * @return Whether or not the given focus component has become focused.
   */
  focus(focusableComponent: FocusableComponent, focusTarget: Focusable): boolean {
    let focusSuccess = false;
    if (this._canFocus(focusableComponent)) {
      focusSuccess = focusTarget.focus();
    }

    // If this component is not focusable, then forward focus transfer to the configured next focus element.
    (focusSuccess)
      ? focusableComponent.focusOutput.emit()
      : this.focusNext(focusableComponent, true);
    return focusSuccess;
  }

  /**
   * Checks if a given focusable component can currently receive focus.
   * In order to be able to receive focus, the component must not be hidden, must not be excplicitly disabled,
   * and must either be explicitly enabled or have its editable flag set to true.
   * @param focusableComponent The focusable component to check.
   * @return Whether or not the component can currently receive focus.
   */
  private _canFocus(focusableComponent: FocusableComponent): boolean {
    const invisible: boolean = focusableComponent.visible && (
         focusableComponent.visible === 'collapse'
      || focusableComponent.visible === 'hidden'
    );
    // Must check if explicitely enabled or disabled. Can be undefined otherwise, which will not impact ability to focus.
    const enabled: boolean = _.toBoolean(focusableComponent.enabled);
    const disabled: boolean = (focusableComponent.enabled === false || focusableComponent.enabled === 'false');
    const editable: boolean = _.toBoolean(focusableComponent.editable);
    return (!invisible && !disabled && (enabled || editable));
  }

  /**
   * Applies focus to the configured next focusable component or native element.
   * @param focusableComponent The focusable component.
   * @param preventEmitBlur Optionally set to true in order to prevent a blur event from being emitted fromt he given focusable component.
   * @return Whether or not the configured next focusable component or native element has received focus.
   */
  focusNext(focusableComponent: FocusableComponent, preventEmitBlur = false): boolean {
    const focusSuccess = focusableComponent.nextFocus?.focus();
    if (focusSuccess && !preventEmitBlur) {
      focusableComponent.blur?.emit();
    }
    return !!focusSuccess;
  }
}
