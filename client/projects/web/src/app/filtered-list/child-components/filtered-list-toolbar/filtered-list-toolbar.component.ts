import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { FilteredListService } from '~web/filtered-list/services/filtered-list/filtered-list.service';

@Component({
  selector: 'foodweb-filtered-list-toolbar',
  templateUrl: './filtered-list-toolbar.component.html',
  styleUrls: ['./filtered-list-toolbar.component.scss'],
})
export class FilteredListToolbarComponent implements OnInit {

  @Input() excludeFilterButton = false;
  @Input() listItemsLabel = '';

  @HostBinding() class = 'foodweb-filtered-list-toolbar';

  constructor(
    public filteredListService: FilteredListService
  ) {}

  ngOnInit() {}

}
