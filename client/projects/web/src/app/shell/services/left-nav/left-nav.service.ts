import { Injectable } from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeftNavService {

  sticky = false;
  mode: 'side' | 'over' = 'over';

  private _opened: boolean;
  private _openedChanged = new Subject<boolean>();
  private _drawerContent: MatDrawerContent;

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

  initDrawerContent(drawerContent: MatDrawerContent): void {
    this._drawerContent = drawerContent;
  }

  toggle(): void {
    this._setOpened(!this._opened);
  }

  private _setOpened(opened: boolean): void {
    this._opened = opened;
    this._openedChanged.next(this._opened);
  }

  scrollContentToTop(scrollBehavior: ScrollBehavior = 'smooth'): void {
    if (this._drawerContent) {
      this._drawerContent.getElementRef().nativeElement.scrollTo({ top: 0, behavior: scrollBehavior });
    }
  }
}
