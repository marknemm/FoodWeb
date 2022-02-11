import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { PageListService } from '~web/page-list/services/page-list/page-list.service';

@Component({
  selector: 'foodweb-page-list-filters-footer',
  templateUrl: './page-list-filters-footer.component.html',
  styleUrls: ['./page-list-filters-footer.component.scss'],
})
export class PageListFiltersFooterComponent {

  @Output() clear = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  @HostBinding() class = 'foodweb-page-list-filters-footer';

  constructor(
    private _PageListService: PageListService
  ) {}

  onSubmit(): void {
    this._PageListService.opened = false;
    this.submit.emit();
  }

}
