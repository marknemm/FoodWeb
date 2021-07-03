import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SizeThresholds } from '~web/shared/interfaces/size-thresholds';
export { SizeThresholds };

/**
 * Provides screen size data for the webapps.
 */
@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {

  static readonly WIDTH_XL = Number.MAX_VALUE;
  static readonly WIDTH_LG = 1199;
  static readonly WIDTH_MD = 991;
  static readonly WIDTH_SM = 767;
  static readonly WIDTH_XS = 575;

  constructor() {}

  /**
   * The width of the web browser viewport pixels.
   */
  get width(): number {
    return window.innerWidth;
  }

  /**
   * The height of the web browser viewport pixels.
   */
  get height(): number {
    return window.innerHeight;
  }

  /**
   * Whether or not the current browser viewport width is extra large (XL).
   */
  get isWidthXL(): boolean {
    return (this.width > ScreenSizeService.WIDTH_LG);
  }

  /**
   * Whether or not the current browser viewport width is large (LG).
   */
  get isWidthLG(): boolean {
    return (this.width <= ScreenSizeService.WIDTH_LG && this.width > ScreenSizeService.WIDTH_MD);
  }

  /**
   * Whether or not the current browser viewport width is medium (MD).
   */
  get isWidthMD(): boolean {
    return (this.width <= ScreenSizeService.WIDTH_MD && this.width > ScreenSizeService.WIDTH_SM);
  }

  /**
   * Whether or not the current browser viewport width is small (SM).
   */
  get isWidthSM(): boolean {
    return (this.width <= ScreenSizeService.WIDTH_SM && this.width > ScreenSizeService.WIDTH_XS);
  }

  /**
   * Whether or not the current browser viewport width is extra small (XS).
   */
  get isWidthXS(): boolean {
    return (this.width <= ScreenSizeService.WIDTH_XS);
  }

  /**
   * Gets an observable that emits the current screen/display width whenever a resize or orientation change occurs.
   * @param destroy$ An optional observable that will be used to destroy the returned observable once it first emits.
   * @return The resize observable.
   */
  onResize(destroy$: Observable<any> = new Observable()): Observable<number> {
    const resizeSubject = new Subject<number>();
    const resizeHandlerFn = () => resizeSubject.next(this.width);
    window.addEventListener('resize', resizeHandlerFn);

    return resizeSubject.asObservable().pipe(
      takeUntil(destroy$),
      finalize(() => window.removeEventListener('resize', resizeHandlerFn))
    );
  }

  /**
   * Gets the current width based off of the browser viewport width.
   * @param size The width at each threshold or a single width number for all thresholds.
   * @return The current width.
   */
  getCurrentWidth(size: SizeThresholds | number): number {
    if (typeof size === 'number') {
      return size;
    }

    if (this.isWidthXL) {
      return (size.xl || size.lg || size.md || size.sm || size.xs);
    }

    if (this.isWidthLG) {
      return (size.lg || size.md || size.sm || size.xs || size.xl);
    }

    if (this.isWidthMD) {
      return (size.md || size.sm  || size.xs || size.lg || size.xl);
    }

    if (this.isWidthSM) {
      return (size.sm || size.xs || size.md || size.lg || size.xl);
    }

    if (this.isWidthXS) {
      return (size.xs || size.sm || size.md || size.lg || size.xl);
    }
  }
}
