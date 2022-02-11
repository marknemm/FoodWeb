import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { PageListService } from '~web/page-list/services/page-list/page-list.service';

@Component({
  selector: 'foodweb-page-list-filters-title',
  templateUrl: './page-list-filters-title.component.html',
  styleUrls: ['./page-list-filters-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageListFiltersTitleComponent {

  @Input() primary = false;

  @HostBinding() class = 'foodweb-page-list-filters-title';

  constructor(
    public pageListService: PageListService
  ) {}

}
