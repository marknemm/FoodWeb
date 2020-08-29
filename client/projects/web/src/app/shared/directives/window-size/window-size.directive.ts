import { Directive, EventEmitter, Output, Input, OnInit, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { ThresholdSide } from '~web/shared/interfaces/threshold-side';
export { ThresholdSide };

/**
 * Monitors the window size and emits an event whenever a given window size threshold (px) is crossed.
 */
@Directive({
  selector: '[foodwebWindowSize]'
})
export class WindowSizeDirective implements OnInit, OnChanges, OnDestroy {

  private _thresholdSide: ThresholdSide;

  /**
   * The window size threshold in pixels. Defaults to 767 (px) for mobile window width.
   */
  @Input('foodwebWindowSize') thresholdPx = 767;

  /**
   * Emitted whenever the window size threshold (thresholdPx) is crossed.
   * Will either emit 'above' for cross to above threshold, or 'below' for cross to below threshold.
   */
  @Output() thresholdCross = new EventEmitter<ThresholdSide>();

  constructor(
    private _window: Window,
  ) {
    this._windowResizeHandler = this._windowResizeHandler.bind(this);
  }

  ngOnInit() {
    this._window.addEventListener('resize', this._windowResizeHandler);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.thresholdPx) {
      this._windowResizeHandler();
    }
  }

  ngOnDestroy() {
    this._window.removeEventListener('resize', this._windowResizeHandler);
  }

  /**
   * Handles window resize events by detecting if a configured window size threshold (thresholdPx) has been crossed.
   */
  private _windowResizeHandler(): void {
    if (window.innerWidth > this.thresholdPx && this._thresholdSide !== 'above') {
      this._thresholdSide = 'above';
      this.thresholdCross.emit(this._thresholdSide);
    } else if (window.innerWidth <= this.thresholdPx && this._thresholdSide !== 'below') {
      this._thresholdSide = 'below';
      this.thresholdCross.emit(this._thresholdSide);
    }
  }

}
