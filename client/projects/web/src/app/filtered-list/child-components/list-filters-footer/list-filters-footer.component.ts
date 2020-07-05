import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilteredListService } from '~web/filtered-list/filtered-list/filtered-list.service';

@Component({
  selector: 'food-web-list-filters-footer',
  templateUrl: './list-filters-footer.component.html',
  styleUrls: ['./list-filters-footer.component.scss'],
})
export class ListFiltersFooterComponent implements OnInit {

  @Output() clear = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  constructor(
    private _filteredListSerivce: FilteredListService
  ) {}

  ngOnInit() {}

  onSubmit(): void {
    this._filteredListSerivce.opened = false;
    this.submit.emit();
  }

}
