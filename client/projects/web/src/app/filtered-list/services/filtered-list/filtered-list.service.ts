import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilteredListService {

  listItemsLabel = '';

  private _opened = false;
  private _openedChange = new Subject<boolean>();

  constructor() {}

  get opened(): boolean {
    return this._opened;
  }

  set opened(open: boolean) {
    this._opened = open;
    this._openedChange.next(open);
  }

  get openedChange(): Observable<boolean> {
    return this._openedChange.asObservable();
  }
}
