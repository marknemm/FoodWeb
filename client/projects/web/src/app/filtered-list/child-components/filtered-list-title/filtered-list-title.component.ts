import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'foodweb-filtered-list-title',
  templateUrl: './filtered-list-title.component.html',
  styleUrls: ['./filtered-list-title.component.scss'],
})
export class FilteredListTitleComponent implements OnInit {

  @HostBinding() class = 'foodweb-filtered-list-title';

  constructor() {}

  ngOnInit() {}

}
