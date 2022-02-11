import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'foodweb-hybrid-page-list-filters-section',
  templateUrl: './page-list-filters-section.component.html',
  styleUrls: ['./page-list-filters-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageListFiltersSectionComponent {

  @HostBinding() class = 'foodweb-page-list-filters-section';

}
