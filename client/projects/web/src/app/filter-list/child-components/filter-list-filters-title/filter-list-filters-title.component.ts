import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'food-web-filter-list-filters-title',
  templateUrl: './filter-list-filters-title.component.html',
  styleUrls: ['./filter-list-filters-title.component.scss'],
})
export class FilterListFiltersTitleComponent implements OnInit {

  @Input() primary = false;

  constructor() {}

  ngOnInit() {}

}
