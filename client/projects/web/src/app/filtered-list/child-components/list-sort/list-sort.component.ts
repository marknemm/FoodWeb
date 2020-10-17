import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SortByOpt } from '~web/filtered-list/interfaces/sort-by-opt';
export { SortByOpt };

@Component({
  selector: 'foodweb-list-sort',
  templateUrl: './list-sort.component.html',
  styleUrls: ['./list-sort.component.scss'],
})
export class ListSortComponent<T> implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() sortByFormControlName = 'sortBy';
  @Input() sortByOpts: SortByOpt<T>[] = [];
  @Input() sortOrderFormControlName = 'sortOrder';

  constructor() {}

  ngOnInit() {}

}
