import { Injectable } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShellService {

  readonly windowSizeThreshPx = 991;

  sticky = false;

  private _leftNavMode: MatDrawerMode = 'over';
  private _leftNavOpened = false;
  private _leftNavOpenedChanged = new Subject<boolean>();
  private _mainContent: HTMLElement;

  constructor() {}

  get leftNavMode(): MatDrawerMode {
    return this._leftNavMode;
  }

  set leftNavMode(mode: MatDrawerMode) {
    this._leftNavMode = mode;
    this.leftNavOpened = (this.leftNavMode === 'side');
  }

  get leftNavOpened(): boolean {
    return this._leftNavOpened;
  }

  set leftNavOpened(open: boolean) {
    this._setLeftNavOpened(open);
  }

  get leftNavOpenedChanged(): Observable<boolean> {
    return this._leftNavOpenedChanged.asObservable();
  }

  setMainContent(mainContent: HTMLElement): void {
    this._mainContent = mainContent;
  }

  toggleLeftNav(): void {
    this._setLeftNavOpened(!this._leftNavOpened);
  }

  protected _setLeftNavOpened(opened: boolean): void {
    this._leftNavOpened = opened;
    this._leftNavOpenedChanged.next(this._leftNavOpened);
  }

  scrollContentToTop(scrollBehavior: ScrollBehavior = 'smooth'): void {
    if (this._mainContent) {
      this._mainContent.scrollTo({ top: 0, behavior: scrollBehavior });
    }
  }
}
