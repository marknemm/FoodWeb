import { Component, HostBinding, Input } from '@angular/core';
import { FilteredListService } from '~web/filtered-list/services/filtered-list/filtered-list.service';

/**
 * A filtered list container component that surrounds various parts of a filtered list page.
 */
@Component({
  selector: 'foodweb-filtered-list',
  templateUrl: './filtered-list.component.html',
  styleUrls: ['./filtered-list.component.scss']
})
export class FilteredListComponent {

  /**
   * The opened state of the filters right drawer.
   */
  @Input() set filtersOpened(open: boolean) { this.filteredListService.opened = open; }
           get filtersOpened(): boolean     { return this.filteredListService.opened; }

  @HostBinding() class = 'foodweb-filtered-list';

  constructor(
    public filteredListService: FilteredListService
  ) {
    // Important to reset service value here instead of in ngOnInit() so we don't overwrite @Input value if one is given.
    this.filteredListService.opened = false;
  }
}
