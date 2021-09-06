import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageProgressService {

  backdropColor: string;
  blockingColor: string;
  diameter: number;
  excludeBackdrop: boolean;
  nonBlockingColor: string;
  strokeWidth: number;
  trigger: boolean;
  value: number;

  protected _blocking: boolean;
  protected _color: string;

  constructor(
    protected _router: Router,
  ) {
    this._listenForRouteChange();
    this.reset();
  }

  /**
   * Whether or not the page progress indicator is set to blocking mode.
   */
  get blocking(): boolean {
    return this._blocking;
  }

  set blocking(blocking: boolean) {
    this._blocking = blocking;
    this._color = (this._blocking ? this.blockingColor : this.nonBlockingColor);
  }

  /**
   * The color of the page progress indicator.
   */
  get color(): string {
    return this._color;
  }

  /**
   * Whether or not a blocking page progress indicator should be showing.
   */
  get showBlockingProgress(): boolean {
    return (this.trigger && this.blocking);
  }

  /**
   * Whether or not a non-blocking page progress indicator should be showing.
   */
  get showNonBlockingProgress(): boolean {
    return (this.trigger && !this.blocking);
  }

  /**
   * Activates/shows the page progress indicator.
   * @param blocking true if the page progress indicator should be blocking, false if not.
   */
  activate(blocking: boolean): void {
    this.blocking = blocking;
    this.trigger = true;
  }

  /**
   * Deactivates/hides the page progress indicator.
   */
  deactivate(): void {
    this.trigger = false;
  }

  /**
   * Resets the page progress indicator to contain its default properties & deactivates/hides it.
   */
  reset(): void {
    this.backdropColor = 'rgba(211, 211, 211, .5)';
    this.blockingColor = '';
    this.diameter = 150;
    this.excludeBackdrop = false;
    this.nonBlockingColor = '';
    this.trigger = false;
    this.blocking = false;
    this.value = undefined;
  }

  /**
   * Listens for changes in the current URL/Route, and resets the page progress indicator on route change.
   */
  protected _listenForRouteChange(): void {
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.reset();
      }
    });
  }
}
