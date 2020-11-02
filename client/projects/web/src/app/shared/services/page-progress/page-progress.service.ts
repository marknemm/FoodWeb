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
  trigger: boolean;
  value: number;

  protected _blocking: boolean;
  protected _color: string;
  protected _strokeWidth: number;

  constructor(
    router: Router,
  ) {
    this._listenForRouteChange(router);
    this.reset();
  }

  get blocking(): boolean {
    return this._blocking;
  }

  set blocking(blocking: boolean) {
    this._blocking = blocking;
    this._color = (this._blocking ? this.blockingColor : this.nonBlockingColor);
  }

  get color(): string {
    return this._color;
  }

  get showBlockingProgress(): boolean {
    return (this.trigger && this.blocking);
  }

  get showNonBlockingProgress(): boolean {
    return (this.trigger && !this.blocking);
  }

  get strokeWidth(): number {
    return this._strokeWidth;
  }

  activate(blocking: boolean): void {
    this.reset();
    this.blocking = blocking;
    this.trigger = true;
  }

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

  protected _listenForRouteChange(router: Router): void {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.trigger = false;
      }
    });
  }
}
