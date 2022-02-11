import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'foodweb-page-list-filters',
  templateUrl: './page-list-filters.component.html',
  styleUrls: ['./page-list-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageListFiltersComponent {

  @HostBinding() class = 'foodweb-page-list-filters';

}
