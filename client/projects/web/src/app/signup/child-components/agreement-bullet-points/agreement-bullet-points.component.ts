import { Component, Input, OnInit } from '@angular/core';
import { AccountType } from '~shared';

@Component({
  selector: 'food-web-agreement-bullet-points',
  templateUrl: './agreement-bullet-points.component.html',
  styleUrls: ['./agreement-bullet-points.component.scss']
})
export class AgreementBulletPointsComponent implements OnInit {

  @Input() accountType: AccountType;

  constructor() {}

  ngOnInit() {}

}
