import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'foodweb-filtered-list-instructions',
  templateUrl: './filtered-list-instructions.component.html',
  styleUrls: ['./filtered-list-instructions.component.scss']
})
export class FilteredListInstructionsComponent implements OnInit {

  @HostBinding() class = 'foodweb-filtered-list-instructions';

  constructor() {}

  ngOnInit() {}

}
