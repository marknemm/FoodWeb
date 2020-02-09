import { Component, Input, OnInit } from '@angular/core';
import { FilterListService } from '~web/filter-list/filter-list/filter-list.service';

@Component({
  selector: 'food-web-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent implements OnInit {

  @Input() listItemsLabel = '';
  @Input() totalCount: number;

  @Input() set filtersOpened(open: boolean) {
    this.filterListService.opened = open;
  }
  get filtersOpened(): boolean {
    return this.filterListService.opened;
  }

  constructor(
    public filterListService: FilterListService
  ) {
    // Important to reset service value here instead of in ngOnInit() so we don't overwrite @Input value if one is given.
    this.filterListService.opened = false;
  }

  ngOnInit() {}

}
