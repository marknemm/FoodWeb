import { Injectable } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router, Event } from '@angular/router';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';

@Injectable({
  providedIn: 'root'
})
export class PageProgressService {

  backdropColor: string;
  backdropOpacity: number;
  backdropVisible: boolean;
  blockingColor: string;
  blockingStrokeWidth: number;
  diameter: number;
  mode: ProgressSpinnerMode;
  nonBlockingColor: string;
  nonBlockingStrokeWidth: number;
  trigger: boolean;
  value: number;

  private _blocking: boolean;
  private _blockingProgressWidth: string;
  private _color: string;
  private _strokeWidth: number;

  constructor(
    protected _leftNavService: LeftNavService,
    router: Router,
  ) {
    this._leftNavService.openedChanged.subscribe(this._onLeftNavOpenedChanged.bind(this));
    this._onLeftNavOpenedChanged(this._leftNavService.opened);
    this._listenForRouteChange(router);
    this.reset();
  }

  get blocking(): boolean {
    return this._blocking;
  }

  set blocking(blocking: boolean) {
    this._blocking = blocking;
    this._color = (this._blocking ? this.blockingColor : this.nonBlockingColor);
    this._strokeWidth = (this._blocking ? this.blockingStrokeWidth : this.nonBlockingStrokeWidth);
  }

  get blockingProgressWidth(): string {
    return this._blockingProgressWidth;
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
    this.backdropColor = 'lightgray';
    this.backdropOpacity = 0.5;
    this.backdropVisible = true;
    this.blockingColor = 'primary';
    this.blockingStrokeWidth = 7;
    this.diameter = 150;
    this.mode = 'indeterminate';
    this.nonBlockingColor = 'accent';
    this.nonBlockingStrokeWidth = 2;
    this.trigger = false;
    this.value = undefined;
    this.blocking = false;
  }

  private _onLeftNavOpenedChanged(opened: boolean): void {
    this._blockingProgressWidth = (opened && this._leftNavService.mode === 'side') ?
      `calc(100vw - 180px)` :
      '100vw';
  }

  private _listenForRouteChange(router: Router): void {
    router.events.subscribe((event: Event) => {
      if (event instanceof PageTransitionEvent) {
        this.trigger = false;
      }
    });
  }
}
