import { Injectable } from '@angular/core';
import { Focusable, FocusableComponent } from '~app/app-shared/interfaces/focusable';
import { AppVisibilityService } from '../app-visibility/app-visibility.service';
export * from '~app/app-shared/interfaces/focusable';

/**
 * Handles transfer of focus between focusable components and/or focusable native elements.
 */
@Injectable({
  providedIn: 'root'
})
export class AppFocusService {

  constructor(
    private _visiblityService: AppVisibilityService
  ) {}

  /**
   * Applies focus to a given focusable component.
   * If the focusable component is not currently enabled, then attempts to forward focus to the configurated next focus element.
   * @param focusableComponent The focusable component.
   * @param focusTarget The component's internal focus target (can be a native element or another focusable component).
   * @return Whether or not the given focus component has become focused.
   */
  focus(focusableComponent: FocusableComponent, focusTarget: Focusable): boolean {
    let focusSuccess = false;
    if (focusableComponent.focusable) {
      focusSuccess = focusTarget.focus();
    }

    // If this component is not focusable, then forward focus transfer to the configured next focus element.
    (focusSuccess)
      ? focusableComponent.focusOutput.emit()
      : this.focusNext(focusableComponent, true);
    return focusSuccess;
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

  /**
   * Generates focusable state based off of a given list of focus flags.
   * @param focusFlags A list of flags that will be used to generate the focusable state.
   * @return The focusable state.
   */
  isFocusable(focusFlags: (boolean | VisibleInput)[]): boolean {
    return focusFlags.reduce((prev: boolean, current: boolean | VisibleInput) =>
      prev && (current === true || this._visiblityService.isVisible(current))
    , true);
  }
}
