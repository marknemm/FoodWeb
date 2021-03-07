import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'foodweb-filtered-list-content',
  templateUrl: './filtered-list-content.component.html',
  styleUrls: ['./filtered-list-content.component.scss'],
})
export class FilteredListContentComponent implements OnInit {

  @HostBinding() class = 'foodweb-filtered-list-content';

  constructor() {}

  ngOnInit() {}

}
