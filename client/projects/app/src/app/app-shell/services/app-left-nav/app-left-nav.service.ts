import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLeftNavService {

  private _opened: boolean;
  private _openedChanged = new Subject<boolean>();

  constructor() {}

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

  private _setOpened(opened: boolean): void {
    this._opened = opened;
    this._openedChanged.next(this._opened);
  }
}
