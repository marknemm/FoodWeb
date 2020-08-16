import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Injectable({
  providedIn: 'root'
})
export class AppLeftNavService {

  private _openedChanged = new Subject<boolean>();

  constructor() {}

  get radSideDrawer(): RadSideDrawer {
    return <RadSideDrawer>Application.getRootView();
  }

  get opened(): boolean {
    return this.radSideDrawer.getIsOpen();
  }

  set opened(open: boolean) {
    this._setOpened(open);
  }

  get openedChanged(): Observable<boolean> {
    return this._openedChanged.asObservable();
  }

  toggle(): void {
    this._setOpened(!this.opened);
  }

  private _setOpened(opened: boolean): void {
    this._openedChanged.next(this.opened);
    (opened)
      ? this.radSideDrawer.showDrawer()
      : this.radSideDrawer.closeDrawer();
  }
}
