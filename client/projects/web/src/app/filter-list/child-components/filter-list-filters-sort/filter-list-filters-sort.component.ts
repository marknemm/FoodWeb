import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SortByOpt } from '~web/filter-list/sort-by-opt';
export { SortByOpt };

@Component({
  selector: 'food-web-filter-list-filters-sort',
  templateUrl: './filter-list-filters-sort.component.html',
  styleUrls: ['./filter-list-filters-sort.component.scss'],
})
export class FilterListFiltersSortComponent<T> implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() sortByFormControlName = 'sortBy';
  @Input() sortByOpts: SortByOpt<T>[] = [];
  @Input() sortOrderFormControlName = 'sortOrder';

  constructor() {}

  ngOnInit() {}

}
