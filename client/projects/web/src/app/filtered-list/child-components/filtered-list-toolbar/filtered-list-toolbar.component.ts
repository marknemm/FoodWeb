import { Component, OnInit, Input } from '@angular/core';
import { FilteredListService } from '~web/filtered-list/services/filtered-list/filtered-list.service';

@Component({
  selector: 'foodweb-filtered-list-toolbar',
  templateUrl: './filtered-list-toolbar.component.html',
  styleUrls: ['./filtered-list-toolbar.component.scss'],
})
export class FilteredListToolbarComponent implements OnInit {

  @Input() excludeFilterButton = false;

  constructor(
    public filteredListService: FilteredListService
  ) {}

  ngOnInit() {}

}
