import { Component, HostBinding, Input } from '@angular/core';
import { PageListService } from '~web/page-list/services/page-list/page-list.service';

/**
 * A full-page list container component that surrounds various customizable parts.
 */
@Component({
  selector: 'foodweb-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent {

  /**
   * The opened state of the filters right drawer.
   */
  @Input() set filtersOpened(open: boolean) { this.pageListService.opened = open; }
           get filtersOpened(): boolean     { return this.pageListService.opened; }

  @HostBinding() class = 'foodweb-page-list';

  constructor(
    public pageListService: PageListService
  ) {
    // Important to reset service value here instead of in ngOnInit() so we don't overwrite @Input value if one is given.
    this.pageListService.opened = false;
  }
}
