import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'foodweb-list-filters',
  templateUrl: './list-filters.component.html',
  styleUrls: ['./list-filters.component.scss']
})
export class ListFiltersComponent implements OnInit {

  @HostBinding() class = 'foodweb-list-filters';

  constructor() {}

  ngOnInit() {}
}
