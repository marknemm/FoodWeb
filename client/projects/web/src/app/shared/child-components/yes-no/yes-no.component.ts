import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'foodweb-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.scss'],
})
export class YesNoComponent implements OnInit {

  @Input() noTxt = 'No';
  @Input() yes = false;
  @Input() yesTxt = 'Yes';

  constructor() {}

  ngOnInit() {}

}
