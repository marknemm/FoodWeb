import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MobileDeviceService } from '~hybrid/shared/services/mobile-device/mobile-device.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[focusNext]'
})
export class FocusNextDirective implements OnChanges {

  @Input() focusNext: FocusNextElement;

  private _element: HTMLElement;

  constructor(
    private _mobileDeviceService: MobileDeviceService,
    element: ElementRef
  ) {
    this._element = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Change enter key hint to 'next' on iOS devices if there exists a 'focusNext' element.
    if (this._mobileDeviceService.ios && changes.focusNext) {
      this._element.enterKeyHint = (this.focusNext ? 'next' : '');
    }
  }

  /**
   * Handles keyup events on the host element. Detects all 'Enter' key releases on iOS devices,
   * and transfers focus to the `focusNext` element if one has been bound via `@Input`.
   * @param event The keyup `KeyboardEvent`.
   */
  @HostListener('keyup', ['$event'])
  onKeyup(event: KeyboardEvent): void {
    if (this._mobileDeviceService.ios && this.focusNext && event.key === 'Enter') {
      (this.focusNext.setFocus)
        ? this.focusNext.setFocus()
        : this.focusNext.focus();
    }
  }

}

export type FocusNextElement = HTMLElement & { setFocus?: () => Promise<void> };
