import { Component, Input, OnInit } from '@angular/core';
import { FilterListService } from '~web/filter-list/filter-list/filter-list.service';

@Component({
  selector: 'food-web-filter-list-filters-title',
  templateUrl: './filter-list-filters-title.component.html',
  styleUrls: ['./filter-list-filters-title.component.scss'],
})
export class FilterListFiltersTitleComponent implements OnInit {

  @Input() primary = false;

  constructor(
    public filterListService: FilterListService
  ) {}

  ngOnInit() {}

}
