import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PageListService } from '~web/page-list/services/page-list/page-list.service';

@Component({
  selector: 'foodweb-page-list-toolbar',
  templateUrl: './page-list-toolbar.component.html',
  styleUrls: ['./page-list-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageListToolbarComponent {

  @Input() excludeFilterButton = false;
  @Input() listItemsLabel = '';

  @HostBinding() class = 'foodweb-page-list-toolbar';

  constructor(
    public pageListService: PageListService
  ) {}

}
