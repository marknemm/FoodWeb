import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FilterListService } from '~web/filter-list/filter-list/filter-list.service';

@Component({
  selector: 'food-web-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
  providers: [FilterListService]
})
export class FilterListComponent implements OnInit, OnDestroy {

  @Input() filtersOpened = false;
  @Input() listItemsLabel = '';
  @Input() totalCount: number;

  @Output() openedChange = new EventEmitter<boolean>();

  private _destory$ = new Subject<void>();

  constructor(
    private _filterListService: FilterListService
  ) {}

  ngOnInit() {
    this._filterListService.listenFiltersSubmitted(this._destory$).subscribe(
      () => this.onFiltersOpenedChange(false)
    );
  }

  ngOnDestroy() {
    this._destory$.next();
  }

  onFiltersOpenedChange(opened: boolean): void {
    this.filtersOpened = opened;
    this.openedChange.emit(this.filtersOpened);
  }

}
