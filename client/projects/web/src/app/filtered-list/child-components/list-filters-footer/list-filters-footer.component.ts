import { Component, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';
import { FilteredListService } from '~web/filtered-list/services/filtered-list/filtered-list.service';

@Component({
  selector: 'foodweb-list-filters-footer',
  templateUrl: './list-filters-footer.component.html',
  styleUrls: ['./list-filters-footer.component.scss'],
})
export class ListFiltersFooterComponent implements OnInit {

  @Output() clear = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  @HostBinding() class = 'foodweb-list-filters-footer';

  constructor(
    private _filteredListSerivce: FilteredListService
  ) {}

  ngOnInit() {}

  onSubmit(): void {
    this._filteredListSerivce.opened = false;
    this.submit.emit();
  }

}
