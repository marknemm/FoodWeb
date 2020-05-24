import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FilteredListService } from '~web/filtered-list/filtered-list/filtered-list.service';

@Component({
  selector: 'food-web-filtered-list',
  templateUrl: './filtered-list.component.html',
  styleUrls: ['./filtered-list.component.scss']
})
export class FilteredListComponent implements OnInit {

  @Input() excludePaginator = false;
  @Input() listItemsLabel = '';
  @Input() totalCount: number;

  @Input() set filtersOpened(open: boolean) {
    this.filteredListService.opened = open;
  }
  get filtersOpened(): boolean {
    return this.filteredListService.opened;
  }

  constructor(
    public filteredListService: FilteredListService
  ) {
    // Important to reset service value here instead of in ngOnInit() so we don't overwrite @Input value if one is given.
    this.filteredListService.opened = false;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.listItemsLabel) {
      // Set on shared service so other transcluded list coponents may access the list items label.
      this.filteredListService.listItemsLabel = this.listItemsLabel;
    }
  }

}