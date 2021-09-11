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

  protected _blocking: boolean;
  protected _color: string;
  protected _trigger: boolean;

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

  /**
   * The color of the page progress indicator.
   */
  get color(): string {
    return (this.blocking ? this.blockingColor : this.nonBlockingColor);
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
   * The trigger (on/off) status of the page progress indicator.
   */
  get trigger(): boolean {
    return this._trigger;
  }

  /**
   * Activates/shows the page progress indicator.
   * @param blocking true if the page progress indicator should be blocking, false if not.
   */
  activate(blocking: boolean): void {
    this._blocking = blocking;
    this._trigger = true;
  }

  /**
   * Deactivates/hides the page progress indicator.
   */
  deactivate(): void {
    this._trigger = false;
  }

  /**
   * Resets the page progress indicator to contain its default properties & deactivates/hides it.
   */
  reset(): void {
    this.deactivate();
    this.backdropColor = 'rgba(211, 211, 211, .5)';
    this.blockingColor = 'primary';
    this.diameter = 150;
    this.excludeBackdrop = false;
    this.nonBlockingColor = 'primary';
    this._blocking = false;
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
