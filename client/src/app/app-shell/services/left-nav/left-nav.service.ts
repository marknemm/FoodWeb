import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeftNavService {

  private _opened: boolean;
  private _mode: 'side' | 'over';
  private _openedChanged = new Subject<boolean>();
  private _prevWidth: number;

  constructor() {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    this._onWindowResize();
  }

  get mode(): 'side' | 'over' {
    return this._mode;
  }

  get opened(): boolean {
    return this._opened;
  }

  set opened(open: boolean) {
    this._setOpened(open);
  }

  get openedChanged(): Observable<boolean> {
    return this._openedChanged.asObservable();
  }

  toggle(): void {
    this._setOpened(!this._opened);
  }

  private _onWindowResize(): void {
    if (window.innerWidth <= 991 && (!this._prevWidth || this._prevWidth > 991)) {
      this._mode = 'over';
      this._setOpened(false);
    } else if (window.innerWidth > 991 && (!this._prevWidth || this._prevWidth <= 991)) {
      this._mode = 'side';
      this._setOpened(true);
    }
    this._prevWidth = window.innerWidth;
  }

  private _setOpened(opened: boolean): void {
    this._opened = opened;
    this._openedChanged.next(this._opened);
  }
}
