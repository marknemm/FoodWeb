import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FilteredListService } from '~web/filtered-list/services/filtered-list/filtered-list.service';

@Component({
  selector: 'foodweb-list-filters-title',
  templateUrl: './list-filters-title.component.html',
  styleUrls: ['./list-filters-title.component.scss'],
})
export class ListFiltersTitleComponent implements OnInit {

  @Input() primary = false;

  @HostBinding() class = 'foodweb-list-filters-title';

  constructor(
    public filteredListService: FilteredListService
  ) {}

  ngOnInit() {}

}
