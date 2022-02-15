import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: 'foodweb-hybrid-page-list-filters-footer',
  templateUrl: './page-list-filters-footer.component.html',
  styleUrls: ['./page-list-filters-footer.component.scss'],
})
export class PageListFiltersFooterComponent {

  @Output() clear = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  @HostBinding() class = 'foodweb-page-list-filters-footer';

}
