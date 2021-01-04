import { Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { Convert } from '~web/component-decorators';
import { ThresholdSide } from '~web/shared/interfaces/threshold-side';
import { ScreenSizeService } from '~web/shared/services/screen-size/screen-size.service';
export { ThresholdSide };

/**
 * Monitors the window size and emits an event whenever a given window size threshold (px) is crossed.
 */
@Directive({
  selector: '[foodwebWindowSize]'
})
export class WindowSizeDirective implements OnInit, OnChanges, OnDestroy {

  private _destroy$ = new Subject();
  private _thresholdSide: ThresholdSide;

  /**
   * The window size threshold in pixels. Defaults to 767 (px) for mobile window width.
   */
  @Convert()
  @Input('foodwebWindowSize') thresholdPx: number = 767;

  /**
   * Emitted whenever the window size threshold (thresholdPx) is crossed.
   * Will either emit 'above' for cross to above threshold, or 'below' for cross to below threshold.
   */
  @Output() thresholdCross = new EventEmitter<ThresholdSide>();

  constructor(
    private _screenSizeService: ScreenSizeService
  ) {
    this._windowResizeHandler = this._windowResizeHandler.bind(this);
  }

  ngOnInit() {
    this._screenSizeService.onResize(this._destroy$).subscribe(
      () => this._windowResizeHandler()
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.thresholdPx) {
      this._windowResizeHandler();
    }
  }

  ngOnDestroy() {
    this._destroy$.next(); // Cleanup any RxJS subscriptions.
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
