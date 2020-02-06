import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class FilterListService {

  filtersSubmitted = new Subject<void>();

  constructor() {}

  listenFiltersSubmitted(destory$: Observable<any>): Observable<void> {
    return this.filtersSubmitted.asObservable().pipe(
      takeUntil(destory$)
    );
  }
}
