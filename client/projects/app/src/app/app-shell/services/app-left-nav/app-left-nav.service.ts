import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppLeftNavService {

  private _openedChanged = new Subject<boolean>();
  private _isLocked = false;

  constructor() {}

  get opened(): boolean {
    return this.radSideDrawer.getIsOpen();
  }

  set opened(open: boolean) {
    this._setOpened(open);
  }

  get openedChanged(): Observable<boolean> {
    return this._openedChanged.asObservable();
  }

  get isLocked(): boolean {
    return this._isLocked;
  }

  get radSideDrawer(): RadSideDrawer {
    return <RadSideDrawer>Application.getRootView();
  }

  toggle(): void {
    this._setOpened(!this.opened);
  }

  lock(): void {
    this._setOpened(false);
    this.radSideDrawer.gesturesEnabled = false;
    this._isLocked = true;
  }

  lockUntil(obs$: Observable<any>): void {
    this._isLocked = true;
    obs$.pipe(take(1)).subscribe(
      () => this._isLocked = false
    );
  }

  unlock(): void {
    this.radSideDrawer.gesturesEnabled = true;
    this._isLocked = false;
  }

  private _setOpened(opened: boolean): void {
    this._openedChanged.next(this.opened);
    (opened)
      ? this.radSideDrawer.showDrawer()
      : this.radSideDrawer.closeDrawer();
  }
}
