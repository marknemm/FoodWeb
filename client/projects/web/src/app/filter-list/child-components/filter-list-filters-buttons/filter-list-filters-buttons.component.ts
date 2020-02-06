import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterListService } from '~web/filter-list/services/filter-list/filter-list.service';

@Component({
  selector: 'food-web-filter-list-filters-buttons',
  templateUrl: './filter-list-filters-buttons.component.html',
  styleUrls: ['./filter-list-filters-buttons.component.scss'],
})
export class FilterListFiltersButtonsComponent implements OnInit {

  @Output() clear = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  constructor(
    private _filterListSerivce: FilterListService
  ) {}

  ngOnInit() {}

  onSubmit(): void {
    this._filterListSerivce.filtersSubmitted.next();
    this.submit.emit();
  }

}
