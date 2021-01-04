import { Component, Input, OnInit } from '@angular/core';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.scss'],
})
export class YesNoComponent implements OnInit {

  @Input() noTxt = 'No';
  @Convert()
  @Input() yes: boolean = false;
  @Input() yesTxt = 'Yes';

  constructor() {}

  ngOnInit() {}

}
