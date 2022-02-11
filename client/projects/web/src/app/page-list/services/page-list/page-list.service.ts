import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Contains functionality for a filtered list component.
 */
@Injectable({
  providedIn: 'root'
})
export class PageListService {

  private _opened = false;
  private _openedChange = new Subject<boolean>();

  constructor() {}

  /**
   * The opened state of the list filters drawer.
   */
  get opened(): boolean {
    return this._opened;
  }

  set opened(open: boolean) {
    this._opened = open;
    this._openedChange.next(open);
  }

  /**
   * An observable that emits the opened state of the list filters drawer whenever it changes.
   */
  get openedChange(): Observable<boolean> {
    return this._openedChange.asObservable();
  }
}
