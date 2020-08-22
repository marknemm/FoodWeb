import { Injectable } from '@angular/core';
import { PageProgressService } from '~web/shared/service/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class AppPageProgressService extends PageProgressService {

  backdropColor: string;
  backdropOpacity: number;
  backdropVisible: boolean;
  blockingColor: string;
  blockingStrokeWidth: number;
  diameter: number;
  mode: string;
  nonBlockingColor: string;
  nonBlockingStrokeWidth: number;
  trigger: boolean;
  value: number;

  private _blocking: boolean;
  private _blockingProgressWidth: string;
  private _color: string;
  private _strokeWidth: number;

  constructor() {
    super();
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
}
