import { Component, Input, OnInit } from '@angular/core';
import { FilteredListService } from '~web/filtered-list/filtered-list/filtered-list.service';

@Component({
  selector: 'food-web-list-filters-title',
  templateUrl: './list-filters-title.component.html',
  styleUrls: ['./list-filters-title.component.scss'],
})
export class ListFiltersTitleComponent implements OnInit {

  @Input() primary = false;

  constructor(
    public filteredListService: FilteredListService
  ) {}

  ngOnInit() {}

}
