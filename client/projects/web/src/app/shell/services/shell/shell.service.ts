import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShellService {

  readonly windowSizeThreshPx = 991;

  sticky = false;
  leftNavMode: 'side' | 'over' = 'over';

  protected _leftNavOpened = false;
  protected _leftNavOpenedChanged = new Subject<boolean>();
  protected _mainContent: HTMLElement;

  constructor() {}

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

  refreshLeftNavState(widthPx: number): 'side' | 'over' {
    if (widthPx > this.windowSizeThreshPx && this.leftNavMode !== 'side') {
      this.leftNavMode = 'side';
      this._setLeftNavOpened(true);
    } else if (widthPx <= this.windowSizeThreshPx && this.leftNavMode !== 'over') {
      this.leftNavMode = 'over';
      this._setLeftNavOpened(false);
    }
    return this.leftNavMode;
  }
}
